 const authStatus = document.getElementById('auth-status');
    const gameOptions = document.getElementById('game-options');
    const randomWaitingContainer = document.getElementById('randomWaitingContainer');
    const privateLobbyContainer = document.getElementById('privateLobbyContainer');
    const joinedLobbyContainer = document.getElementById('joinedLobbyContainer');
    const findRandomBtn = document.getElementById('findRandomBtn');
    const createLobbyBtn = document.getElementById('createLobbyBtn');
    const joinLobbyBtn = document.getElementById('joinLobbyBtn');
    const lobbyCodeInput = document.getElementById('lobbyCodeInput');
    const lobbyCodeDisplay = document.getElementById('lobbyCodeDisplay');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    const leaveLobbyBtn = document.getElementById('leaveLobbyBtn');
    const leaveLobbyBtnJoined = document.getElementById('leaveLobbyBtnJoined');
    const cancelRandomMatchBtn = document.getElementById('cancelRandomMatchBtn');
    const guestPlayerItem = document.getElementById('guestPlayerItem');
    const guestPlayerName = document.getElementById('guestPlayerName');
    const hostPlayerNameJoined = document.getElementById('hostPlayerNameJoined');
    const userIconDiv = document.getElementById('user-icon');
    const authButtonsDiv = document.getElementById('auth-buttons');
    const hamburger = document.getElementById('hamburger');
    
    // Variables
    let currentUser = null;
    let currentLobbyId = null;
    let isHost = false;
    let randomMatchUnsubscribe = null;
    let lobbyUnsubscribe = null;
    
    // Initialize Firebase Auth
    document.addEventListener('DOMContentLoaded', () => {
      // Check if the user is already authenticated
      checkAuthState();
      
      // Listen for changes to the user's authentication state
      firebase.auth().onAuthStateChanged((user) => {
        checkAuthState();
      });
    });
    
    // Check authentication state
    function checkAuthState() {
      const user = firebase.auth().currentUser;
      console.log("Checking auth state:", user);
      
      if (user) {
        // User is signed in
        console.log("User is signed in:", user.email);
        currentUser = user;
        userIconDiv.style.display = 'block'; // Show the user icon
        authButtonsDiv.style.display = 'none'; // Hide the auth buttons
        authStatus.style.display = 'none'; // Hide the login prompt
        gameOptions.style.display = 'grid'; // Show game options
      } else {
        // User is not signed in
        console.log("User is signed out"); // Add this debug line
        currentUser = null;
        userIconDiv.style.display = 'none'; // Hide the user icon
        authButtonsDiv.style.display = 'flex'; // Show the auth buttons
        authStatus.style.display = 'block'; // Show login prompt
        gameOptions.style.display = 'none'; // Hide game options
      }
    }
    
    // Generate a random 4-character lobby code
    function generateLobbyCode() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }
    
    // Show only one container, hide others
    function showOnlyContainer(containerToShow) {
      [randomWaitingContainer, privateLobbyContainer, joinedLobbyContainer].forEach(container => {
        if (container === containerToShow) {
          container.classList.remove('hidden');
        } else {
          container.classList.add('hidden');
        }
      });
      
      // Handle special display for game options
      if (containerToShow === randomWaitingContainer || 
          containerToShow === privateLobbyContainer || 
          containerToShow === joinedLobbyContainer) {
        gameOptions.style.display = 'none';
      } else {
        gameOptions.style.display = currentUser ? 'grid' : 'none';
      }
    }
    
    // Find Random Match
    findRandomBtn.addEventListener('click', async () => {
      if (!currentUser) {
        alert("Please sign in first");
        window.location.href = "signin.html";
        return;
      }
      
      showOnlyContainer(randomWaitingContainer);
      
      try {
        // Check for available lobbies first
        const lobbiesRef = firebase.firestore().collection("lobbies");
        const query = lobbiesRef.where("isPublic", "==", true).where("players", "==", 1).limit(1);
        const querySnapshot = await query.get();
        
        if (!querySnapshot.empty) {
          // Join an existing public lobby
          const lobbyDoc = querySnapshot.docs[0];
          const lobbyId = lobbyDoc.id;
          const lobbyData = lobbyDoc.data();
          
          // Update the lobby with the second player
          await firebase.firestore().collection("lobbies").doc(lobbyId).update({
            players: 2,
            guest: {
              uid: currentUser.uid,
              displayName: currentUser.displayName || "Guest"
            }
          });
          
          currentLobbyId = lobbyId;
          isHost = false;
          
          // Listen for lobby changes
          setupLobbyListener(lobbyId);
        } else {
          // Create a new public lobby
          const lobbyId = generateLobbyCode();
          await firebase.firestore().collection("lobbies").doc(lobbyId).set({
            host: {
              uid: currentUser.uid,
              displayName: currentUser.displayName || "Host"
            },
            isPublic: true,
            players: 1,
            createdAt: new Date().toISOString()
          });
          
          currentLobbyId = lobbyId;
          isHost = true;
          
          // Listen for lobby changes
          setupLobbyListener(lobbyId);
        }
      } catch (error) {
        console.error("Error in random matchmaking:", error);
        alert("Error finding match: " + error.message);
        showOnlyContainer(null); // Show game options
      }
    });
    
    // Cancel Random Match
    cancelRandomMatchBtn.addEventListener('click', async () => {
      if (currentLobbyId && isHost) {
        // If host, delete the lobby
        try {
          await firebase.firestore().collection("lobbies").doc(currentLobbyId).delete();
        } catch (error) {
          console.error("Error deleting lobby:", error);
        }
      } else if (currentLobbyId) {
        // If guest, leave the lobby
        try {
          const lobbyRef = firebase.firestore().collection("lobbies").doc(currentLobbyId);
          const lobbySnap = await lobbyRef.get();
          
          if (lobbySnap.exists) {
            await lobbyRef.update({
              players: 1,
              guest: null
            });
          }
        } catch (error) {
          console.error("Error leaving lobby:", error);
        }
      }
      
      // Clean up listeners
      if (randomMatchUnsubscribe) {
        randomMatchUnsubscribe();
        randomMatchUnsubscribe = null;
      }
      
      currentLobbyId = null;
      isHost = false;
      showOnlyContainer(null); // Show game options
    });
    
    // Create Private Lobby
    createLobbyBtn.addEventListener('click', async () => {
      if (!currentUser) {
        alert("Please sign in first");
        window.location.href = "signin.html";
        return;
      }
      
      try {
        const lobbyId = generateLobbyCode();
        await firebase.firestore().collection("lobbies").doc(lobbyId).set({
          host: {
            uid: currentUser.uid,
            displayName: currentUser.displayName || "Host"
          },
          isPublic: false,
          players: 1,
          createdAt: new Date().toISOString()
        });
        
        currentLobbyId = lobbyId;
        isHost = true;
        lobbyCodeDisplay.textContent = lobbyId;
        
        showOnlyContainer(privateLobbyContainer);
        
        // Listen for lobby changes
        setupLobbyListener(lobbyId);
      } catch (error) {
        console.error("Error creating lobby:", error);
        alert("Error creating lobby: " + error.message);
      }
    });
    
    // Join Private Lobby
    joinLobbyBtn.addEventListener('click', async () => {
      if (!currentUser) {
        alert("Please sign in first");
        window.location.href = "signin.html";
        return;
      }
      
      const lobbyId = lobbyCodeInput.value.trim().toUpperCase();
      if (!lobbyId) {
        alert("Please enter a lobby code");
        return;
      }
      
      try {
        const lobbyRef = firebase.firestore().collection("lobbies").doc(lobbyId);
        const lobbySnap = await lobbyRef.get();
        
        if (!lobbySnap.exists) {
          alert("Lobby not found");
          return;
        }
        
        const lobbyData = lobbySnap.data();
        if (lobbyData.players >= 2) {
          alert("Lobby is full");
          return;
        }
        
        // Update the lobby with the second player
        await lobbyRef.update({
          players: 2,
          guest: {
            uid: currentUser.uid,
            displayName: currentUser.displayName || "Guest"
          }
        });
        
        currentLobbyId = lobbyId;
        isHost = false;
        
        // Set host name in joined view
        hostPlayerNameJoined.textContent = lobbyData.host.displayName;
        
        showOnlyContainer(joinedLobbyContainer);
        
        // Listen for lobby changes
        setupLobbyListener(lobbyId);
      } catch (error) {
        console.error("Error joining lobby:", error);
        alert("Error joining lobby: " + error.message);
      }
    });
    
    // Leave Lobby (Host)
    leaveLobbyBtn.addEventListener('click', async () => {
      if (!currentLobbyId || !isHost) return;
      
      try {
        await firebase.firestore().collection("lobbies").doc(currentLobbyId).delete();
        
        if (lobbyUnsubscribe) {
          lobbyUnsubscribe();
          lobbyUnsubscribe = null;
        }
        
        currentLobbyId = null;
        isHost = false;
        showOnlyContainer(null); // Show game options
      } catch (error) {
        console.error("Error leaving lobby:", error);
        alert("Error leaving lobby: " + error.message);
      }
    });
    
    // Leave Lobby (Guest)
    leaveLobbyBtnJoined.addEventListener('click', async () => {
      if (!currentLobbyId || isHost) return;
      
      try {
        const lobbyRef = firebase.firestore().collection("lobbies").doc(currentLobbyId);
        const lobbySnap = await lobbyRef.get();
        
        if (lobbySnap.exists) {
          await lobbyRef.update({
            players: 1,
            guest: null
          });
        }
        
        if (lobbyUnsubscribe) {
          lobbyUnsubscribe();
          lobbyUnsubscribe = null;
        }
        
        currentLobbyId = null;
        isHost = false;
        showOnlyContainer(null); // Show game options
      } catch (error) {
        console.error("Error leaving lobby:", error);
        alert("Error leaving lobby: " + error.message);
      }
    });
    
    // Copy Lobby Code
    copyCodeBtn.addEventListener('click', () => {
      const lobbyCode = lobbyCodeDisplay.textContent;
      navigator.clipboard.writeText(lobbyCode).then(() => {
        copyCodeBtn.textContent = "Copied!";
        setTimeout(() => {
          copyCodeBtn.textContent = "Copy Code";
        }, 2000);
      });
    });
    
    // Start Game
    startGameBtn.addEventListener('click', async () => {
      if (!currentLobbyId || !isHost) return;
      
      try {
        // Get 10 random questions from Firestore
        const questions = await getRandomQuestions(10);
        
        // Create a new game document
        const gameId = currentLobbyId;
        const lobbyRef = firebase.firestore().collection("lobbies").doc(currentLobbyId);
        const lobbySnap = await lobbyRef.get();
        const lobbyData = lobbySnap.data();
        
        if (!lobbyData || !lobbyData.guest) {
          alert("Cannot start game without a second player");
          return;
        }
        
        await firebase.firestore().collection("games").doc(gameId).set({
          questions: questions,
          players: {
            [lobbyData.host.uid]: {
              displayName: lobbyData.host.displayName,
              answers: [],
              score: 0,
              completed: false
            },
            [lobbyData.guest.uid]: {
              displayName: lobbyData.guest.displayName,
              answers: [],
              score: 0,
              completed: false
            }
          },
          startedAt: new Date().toISOString(),
          status: "active"
        });
        
        // Update the lobby status
        await lobbyRef.update({
          status: "playing"
        });
        
        // Redirect to game page
        window.location.href = `batalie.html?gameId=${gameId}`;
      } catch (error) {
        console.error("Error starting game:", error);
        alert("Error starting game: " + error.message);
      }
    });
    
    // Setup lobby listener
    function setupLobbyListener(lobbyId) {
      if (lobbyUnsubscribe) {
        lobbyUnsubscribe();
      }
      
      lobbyUnsubscribe = firebase.firestore().collection("lobbies").doc(lobbyId)
        .onSnapshot((doc) => {
          if (!doc.exists) {
            // Lobby was deleted
            alert("The lobby was closed");
            showOnlyContainer(null); // Show game options
            currentLobbyId = null;
            isHost = false;
            return;
          }
          
          const data = doc.data();
          
          // Handle lobby status change to "playing"
          if (data.status === "playing") {
            window.location.href = `batalie.html?gameId=${lobbyId}`;
            return;
          }
          
          if (isHost) {
            // Update UI for host
            if (data.players === 2 && data.guest) {
              guestPlayerItem.classList.remove('hidden');
              guestPlayerName.textContent = data.guest.displayName;
              document.getElementById('waitingMessage').classList.add('hidden');
              startGameBtn.classList.remove('hidden');
            } else {
              guestPlayerItem.classList.add('hidden');
              document.getElementById('waitingMessage').classList.remove('hidden');
              startGameBtn.classList.add('hidden');
            }
          }
        }, (error) => {
          console.error("Error listening to lobby:", error);
        });
    }
    
    // Get random questions function
    async function getRandomQuestions(count) {
      try {
        const questionsRef = firebase.firestore().collection("questions");
        const snapshot = await questionsRef.get();
        
        let questions = [];
        snapshot.forEach(doc => {
          questions.push({ id: doc.id, ...doc.data() });
        });
        
        // Shuffle and take required number of questions
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        
        return questions.slice(0, count);
      } catch (error) {
        console.error("Error getting questions:", error);
        throw error;
      }
    }