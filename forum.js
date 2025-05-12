document.addEventListener('DOMContentLoaded', function() {
  // Initialize Firebase (assuming you have firebase-config.js)
  // If your Firebase config is in another file, this should be loaded before this script
  
  // DOM Elements
  const loginMessage = document.getElementById('loginMessage');
  const createPostArea = document.getElementById('createPostArea');
  const postsContainer = document.getElementById('postsContainer');
  const profileBtn = document.getElementById('profileBtn');
  const userAvatar = document.getElementById('userAvatar');
  const userName = document.getElementById('userName');
  const postInput = document.getElementById('postInput');
  const postBtn = document.getElementById('postBtn');
  const closeAuthBtn = document.getElementById('closeAuthBtn');
  const authForm = document.getElementById('authForm');
  const authError = document.getElementById('authError');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const mobileCreatePost = document.getElementById('mobileCreatePost');
  const topicsList = document.getElementById('topicsList');
  const createTopicBtn = document.getElementById('createTopicBtn');
  const createTopicModal = document.getElementById('createTopicModal');
  const closeTopicBtn = document.getElementById('closeTopicBtn');
  const topicForm = document.getElementById('topicForm');
  const topicTitle = document.getElementById('topicTitle');
  const topicDescription = document.getElementById('topicDescription');
  const forumTitle = document.querySelector('.forum-title');
  
  // State variables
  let currentUser = null;
  let currentTopic = null;
  
  // Check if user is logged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      currentUser = user;
      loginMessage.style.display = 'none';
      createPostArea.style.display = 'block';
      
      // Update profile button and user info
      profileBtn.innerHTML = user.photoURL ? 
        `<img src="${user.photoURL}" alt="Profile">` : 
        `<span>${user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</span>`;
      
      userAvatar.innerHTML = user.photoURL ? 
        `<img src="${user.photoURL}" alt="Profile">` : 
        `<span>${user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</span>`;
      
      userName.textContent = user.displayName || user.email;
      
      // Load posts
      loadPosts(currentTopic);
    } else {
      // No user is signed in
      currentUser = null;
      loginMessage.style.display = 'block';
      createPostArea.style.display = 'none';
      
      // Update profile button
      profileBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
      
      // Load posts (still visible to non-logged in users)
      loadPosts(currentTopic);
    }
  });
  
  // Load posts from Firestore for a specific topic
  function loadPosts(topicId) {
    // Clear existing posts
    postsContainer.innerHTML = '';
    
    if (!topicId) {
      postsContainer.innerHTML = '<p class="empty-posts">Selectează un subiect pentru a vedea postările.</p>';
      return;
    }
    
    // Show loading state
    postsContainer.innerHTML = '<p class="loading-posts">Încărcare postări...</p>';
    
    // Check if we're in index creation mode
    let indexCreating = false;
    
    firebase.firestore().collection('posts')
      .where('topicId', '==', topicId)
      .orderBy('timestamp', 'desc')
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          postsContainer.innerHTML = '<p class="empty-posts">Nu există încă postări în acest subiect. Fii primul care începe o discuție!</p>';
          return;
        }
        
        postsContainer.innerHTML = ''; // Clear loading message
        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          const postElement = createPostElement(doc.id, postData);
          postsContainer.appendChild(postElement);
          
          // Load comments for this post
          loadComments(doc.id, postElement);
        });
      })
      .catch((error) => {
        console.error("Error loading posts: ", error);
        
        // Check if it's an indexing error
        if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
          indexCreating = true;
          postsContainer.innerHTML = `
            <div class="index-creating">
              <p>Setare inițială a forumului... Vă rugăm să așteptați câteva momente și reîncărcați pagina.</p>
              <p>Acesta este un proces unic care pregătește forumul pentru utilizare.</p>
            </div>`;
          
          // Alternative approach while waiting for index - get all posts then filter in memory
          // Only do this if there aren't too many posts yet (initial setup)
          firebase.firestore().collection('posts')
            .orderBy('timestamp', 'desc')
            .get()
            .then((allSnapshot) => {
              if (!indexCreating) return; // Skip if we already handled the error
              
              // Filter posts for this topic
              const filteredPosts = [];
              allSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.topicId === topicId) {
                  filteredPosts.push({id: doc.id, data: data});
                }
              });
              
              if (filteredPosts.length === 0) {
                postsContainer.innerHTML = '<p class="empty-posts">Nu există încă postări în acest subiect. Fii primul care începe o discuție!</p>';
                return;
              }
              
              postsContainer.innerHTML = ''; // Clear error message
              filteredPosts.forEach(post => {
                const postElement = createPostElement(post.id, post.data);
                postsContainer.appendChild(postElement);
                
                // Load comments for this post
                loadComments(post.id, postElement);
              });
            })
            .catch(err => {
              console.error("Alternative loading also failed:", err);
              postsContainer.innerHTML = '<p class="error-message">Vă rugăm să reîmprospătați pagina după câteva momente.</p>';
            });
        } else {
          postsContainer.innerHTML = '<p class="error-message">Failed to load posts. Please try again later.</p>';
        }
      });
  }
  
  // Create post element
  function createPostElement(postId, postData) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.id = `post-${postId}`;
    
    // Format date
    const postDate = postData.timestamp ? new Date(postData.timestamp.toDate()) : new Date();
    const formattedDate = postDate.toLocaleDateString() + ' at ' + postDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Create post HTML
    postDiv.innerHTML = `
      <div class="post-header">
        <div class="user-avatar">
          ${postData.userPhotoURL ? 
            `<img src="${postData.userPhotoURL}" alt="${postData.userName}">` : 
            `<span>${postData.userName.charAt(0).toUpperCase()}</span>`}
        </div>
        <div class="post-user-info">
          <div class="post-username">${postData.userName}</div>
          <div class="post-time">${formattedDate}</div>
        </div>
      </div>
      <div class="post-content">
        <p class="post-text">${postData.text}</p>
      </div>
      <div class="post-footer">
        <div class="post-action comment-btn" data-post-id="${postId}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Comment
        </div>
      </div>
      <div class="comments-section" id="comments-${postId}">
        <div class="comments-list"></div>
        <div class="add-comment-form" style="display: none;">
          <textarea class="comment-input" placeholder="Write a comment..."></textarea>
          <button class="comment-submit-btn">Comment</button>
        </div>
      </div>
    `;
    
    // Add event listener for comment button
    const commentBtn = postDiv.querySelector('.comment-btn');
    const addCommentForm = postDiv.querySelector('.add-comment-form');
    
    commentBtn.addEventListener('click', function() {
      if (!currentUser) {
        showAuthModal();
        return;
      }
      
      // Toggle comment form visibility
      if (addCommentForm.style.display === 'none') {
        addCommentForm.style.display = 'flex';
        addCommentForm.querySelector('.comment-input').focus();
      } else {
        addCommentForm.style.display = 'none';
      }
    });
    
    // Add event listener for comment submission
    const commentSubmitBtn = postDiv.querySelector('.comment-submit-btn');
    const commentInput = postDiv.querySelector('.comment-input');
    
    commentSubmitBtn.addEventListener('click', function() {
      const commentText = commentInput.value.trim();
      if (!commentText) return;
      
      addComment(postId, commentText, addCommentForm);
    });
    
    return postDiv;
  }
  
  // Load comments for a post
  function loadComments(postId, postElement) {
    const commentsSection = postElement.querySelector(`#comments-${postId} .comments-list`);
    
    firebase.firestore().collection('comments')
      .where('postId', '==', postId)
      .orderBy('timestamp', 'asc')
      .get()
      .then((querySnapshot) => {
        commentsSection.innerHTML = '';
        
        if (querySnapshot.empty) {
          return; // No comments yet
        }
        
        querySnapshot.forEach((doc) => {
          const commentData = doc.data();
          const commentElement = createCommentElement(commentData);
          commentsSection.appendChild(commentElement);
        });
      })
      .catch((error) => {
        console.error("Error loading comments: ", error);
        commentsSection.innerHTML = '<p class="error-message">Eroare la încărcarea comentariilor.</p>';
      });
  }
  
  // Create comment element
  function createCommentElement(commentData) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    
    // Format date
    const commentDate = commentData.timestamp ? new Date(commentData.timestamp.toDate()) : new Date();
    const formattedDate = commentDate.toLocaleDateString() + ' ' + commentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    commentDiv.innerHTML = `
      <div class="comment-header">
        <div class="comment-user-avatar">
          ${commentData.userPhotoURL ? 
            `<img src="${commentData.userPhotoURL}" alt="${commentData.userName}">` : 
            `<span>${commentData.userName.charAt(0).toUpperCase()}</span>`}
        </div>
        <div class="comment-user-info">
          <div class="comment-username">${commentData.userName}</div>
          <div class="comment-time">${formattedDate}</div>
        </div>
      </div>
      <div class="comment-content">
        <p class="comment-text">${commentData.text}</p>
      </div>
    `;
    
    return commentDiv;
  }
  
  // Add comment to a post
  function addComment(postId, text, commentForm) {
    if (!currentUser) {
      showAuthModal();
      return;
    }
    
    const commentInput = commentForm.querySelector('.comment-input');
    const commentSubmitBtn = commentForm.querySelector('.comment-submit-btn');
    
    commentSubmitBtn.disabled = true;
    commentSubmitBtn.textContent = 'Posting...';
    
    const commentData = {
      postId: postId,
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email,
      userPhotoURL: currentUser.photoURL || null,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    firebase.firestore().collection('comments')
      .add(commentData)
      .then(() => {
        commentInput.value = '';
        commentSubmitBtn.textContent = 'Comment';
        commentSubmitBtn.disabled = false;
        
        // Reload comments for this post
        const postElement = document.getElementById(`post-${postId}`);
        loadComments(postId, postElement);
      })
      .catch((error) => {
        console.error("Error adding comment: ", error);
        commentSubmitBtn.textContent = 'Comment';
        commentSubmitBtn.disabled = false;
        alert('Failed to add comment. Please try again.');
      });
  }
  
  // Create post function
  function createPost() {
    if (!currentUser) {
      showAuthModal();
      return;
    }
    
    if (!currentTopic) {
      alert('Please select or create a topic first.');
      return;
    }
    
    const text = postInput.value.trim();
    if (!text) {
      return;
    }
    
    postBtn.disabled = true;
    postBtn.textContent = 'Posting...';
    
    const postData = {
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email,
      userPhotoURL: currentUser.photoURL || null,
      text: text,
      topicId: currentTopic,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    firebase.firestore().collection('posts')
      .add(postData)
      .then(() => {
        postInput.value = '';
        postBtn.textContent = 'Post';
        postBtn.disabled = false;
        loadPosts(currentTopic); // Reload posts
      })
      .catch((error) => {
        console.error("Error adding post: ", error);
        postBtn.textContent = 'Post';
        postBtn.disabled = false;
        alert('Failed to create post. Please try again.');
      });
  }
  
  // Show auth modal
  function showAuthModal() {
    authModal.style.display = 'flex';
  }
  
  // Handle auth modal close
  function closeAuthModal() {
    authModal.style.display = 'none';
    authError.textContent = '';
    authForm.reset();
  }
  
  // Handle login
  function handleAuth(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
      authError.textContent = 'Please enter both email and password.';
      return;
    }
    
    authSubmitBtn.disabled = true;
    
    // Login only
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        closeAuthModal();
        authSubmitBtn.disabled = false;
      })
      .catch((error) => {
        authError.textContent = error.message;
        authSubmitBtn.disabled = false;
      });
  }
  
  // Load topics from Firestore
  function loadTopics() {
    firebase.firestore().collection('topics')
      .orderBy('timestamp', 'desc')
      .get()
      .then((querySnapshot) => {
        topicsList.innerHTML = '';
        
        if (querySnapshot.empty) {
          topicsList.innerHTML = '<div class="no-topics">No topics yet. Create the first one!</div>';
          return;
        }
        
        querySnapshot.forEach((doc) => {
          const topicData = doc.data();
          const topicElement = document.createElement('div');
          topicElement.className = 'topic-item';
          if (currentTopic && currentTopic === doc.id) {
            topicElement.classList.add('active');
          }
          topicElement.textContent = topicData.title;
          topicElement.dataset.id = doc.id;
          topicElement.addEventListener('click', () => {
            // Set current topic and load posts for this topic
            document.querySelectorAll('.topic-item').forEach(item => {
              item.classList.remove('active');
            });
            topicElement.classList.add('active');
            currentTopic = doc.id;
            forumTitle.textContent = topicData.title;
            loadPosts(doc.id);
          });
          
          topicsList.appendChild(topicElement);
        });
        
        // Select first topic if none is selected
        if (!currentTopic && querySnapshot.docs.length > 0) {
          const firstTopic = querySnapshot.docs[0];
          currentTopic = firstTopic.id;
          forumTitle.textContent = firstTopic.data().title;
          topicsList.querySelector('.topic-item').classList.add('active');
          loadPosts(currentTopic);
        }
      })
      .catch((error) => {
        console.error("Error loading topics: ", error);
        topicsList.innerHTML = '<div class="error-message">Nu s-au încărcat subiectele. Vă rugăm să încercați din nou mai târziu.</div>';
      });
  }
  
  // Create new topic
  function createTopic(e) {
    e.preventDefault();
    
    if (!currentUser) {
      showAuthModal();
      return;
    }
    
    const title = topicTitle.value.trim();
    const description = topicDescription.value.trim();
    
    if (!title || !description) {
      return;
    }
    
    const topicData = {
      title: title,
      description: description,
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    firebase.firestore().collection('topics')
      .add(topicData)
      .then((docRef) => {
        closeTopicModal();
        topicForm.reset();
        loadTopics();
        currentTopic = docRef.id;
      })
      .catch((error) => {
        console.error("Error adding topic: ", error);
        alert('Failed to create topic. Please try again.');
      });
  }
  
  // Show topic modal
  function showTopicModal() {
    if (!currentUser) {
      showAuthModal();
      return;
    }
    createTopicModal.style.display = 'flex';
  }
  
  // Close topic modal
  function closeTopicModal() {
    createTopicModal.style.display = 'none';
    topicForm.reset();
  }
  
  // Handle profile button click
  function handleProfileClick() {
    if (currentUser) {
      // Show dropdown or profile options
      firebase.auth().signOut()
        .then(() => {
          console.log("User signed out");
        })
        .catch((error) => {
          console.error("Sign out error: ", error);
        });
    } else {
      showAuthModal();
    }
  }
  
  // Update post button state
  function updatePostButtonState() {
    const text = postInput.value.trim();
    postBtn.disabled = !text;
  }
  
  // Event Listeners
  postBtn.addEventListener('click', createPost);
  closeAuthBtn.addEventListener('click', closeAuthModal);
  authForm.addEventListener('submit', handleAuth);
  profileBtn.addEventListener('click', handleProfileClick);
  postInput.addEventListener('input', updatePostButtonState);
  createTopicBtn.addEventListener('click', showTopicModal);
  closeTopicBtn.addEventListener('click', closeTopicModal);
  topicForm.addEventListener('submit', createTopic);
  mobileCreatePost.addEventListener('click', function() {
    if (currentUser) {
      if (currentTopic) {
        postInput.focus();
      } else {
        showTopicModal();
      }
    } else {
      showAuthModal();
    }
  });
  
  // Close modals when clicking outside
  authModal.addEventListener('click', function(e) {
    if (e.target === authModal) {
      closeAuthModal();
    }
  });
  
  createTopicModal.addEventListener('click', function(e) {
    if (e.target === createTopicModal) {
      closeTopicModal();
    }
  });
  
  // Load initial topics
  loadTopics();
});