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
      const uploadBtn = document.getElementById('uploadBtn');
      const imageUpload = document.getElementById('imageUpload');
      const imagePreview = document.getElementById('imagePreview');
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
      let selectedFile = null;
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
          loadPosts();
        } else {
          // No user is signed in
          currentUser = null;
          loginMessage.style.display = 'block';
          createPostArea.style.display = 'none';
          
          // Update profile button
          profileBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
          
          // Load posts (still visible to non-logged in users)
          loadPosts();
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
        
        firebase.firestore().collection('posts')
          .where('topicId', '==', topicId)
          .orderBy('timestamp', 'desc')
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              postsContainer.innerHTML = '<p class="empty-posts">Nu există încă postări în acest subiect. Fii primul care începe o discuție!</p>';
              return;
            }
            
            querySnapshot.forEach((doc) => {
              const postData = doc.data();
              const postElement = createPostElement(doc.id, postData);
              postsContainer.appendChild(postElement);
            });
          })
          .catch((error) => {
            console.error("Error loading posts: ", error);
            postsContainer.innerHTML = '<p class="error-message">Failed to load posts. Please try again later.</p>';
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
            ${postData.imageURL ? `<img class="post-image" src="${postData.imageURL}" alt="Post image">` : ''}
          </div>
          <div class="post-footer">
            <div class="post-action">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Comment
            </div>
            <div class="post-action">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share
            </div>
          </div>
        `;
        
        return postDiv;
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
        if (!text && !selectedFile) {
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
        
        const savePostToFirestore = (postData) => {
          firebase.firestore().collection('posts')
            .add(postData)
            .then(() => {
              postInput.value = '';
              imagePreview.innerHTML = '';
              selectedFile = null;
              postBtn.textContent = 'Post';
              postBtn.disabled = false;
              loadPosts(); // Reload posts
            })
            .catch((error) => {
              console.error("Error adding post: ", error);
              postBtn.textContent = 'Post';
              postBtn.disabled = false;
              alert('Failed to create post. Please try again.');
            });
        };
        
        if (selectedFile) {
          // Upload image first if there is one
          const storageRef = firebase.storage().ref();
          const fileRef = storageRef.child(`post-images/${Date.now()}-${selectedFile.name}`);
          
          fileRef.put(selectedFile)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(downloadURL => {
              postData.imageURL = downloadURL;
              savePostToFirestore(postData);
            })
            .catch(error => {
              console.error("Error uploading image: ", error);
              postBtn.textContent = 'Post';
              postBtn.disabled = false;
              alert('Failed to upload image. Please try again.');
            });
        } else {
          savePostToFirestore(postData);
        }
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
      
      // Handle image upload
      function handleImageUpload() {
        imageUpload.click();
      }
      
      // Handle image selection
      function handleImageSelect() {
        const file = imageUpload.files[0];
        if (!file) return;
        
        // Check file type
        if (!file.type.match('image.*')) {
          alert('Please select an image file.');
          return;
        }
        
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB.');
          return;
        }
        
        selectedFile = file;
        
        // Show image preview
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.innerHTML = `
            <div style="position: relative; display: inline-block; margin-top: 10px;">
              <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 4px;">
              <button id="removeImage" style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center;">×</button>
            </div>
          `;
          
          // Add event listener to remove button
          document.getElementById('removeImage').addEventListener('click', function() {
            imagePreview.innerHTML = '';
            selectedFile = null;
            imageUpload.value = '';
            updatePostButtonState();
          });
          
          updatePostButtonState();
        };
        
        reader.readAsDataURL(file);
      }
      
      // Update post button state
      function updatePostButtonState() {
        const text = postInput.value.trim();
        postBtn.disabled = !text && !selectedFile;
      }
      
      // Event Listeners
      postBtn.addEventListener('click', createPost);
      closeAuthBtn.addEventListener('click', closeAuthModal);
      authForm.addEventListener('submit', handleAuth);
      profileBtn.addEventListener('click', handleProfileClick);
      uploadBtn.addEventListener('click', handleImageUpload);
      imageUpload.addEventListener('change', handleImageSelect);
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