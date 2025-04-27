document.addEventListener('DOMContentLoaded', function() {
    const loadingState = document.getElementById('loading-state');
    const errorMessage = document.getElementById('error-message');
    const dashboardContent = document.getElementById('dashboard-content');
    const progressModules = document.querySelector('.progress-modules');
    
    // Check if the user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is logged in, show dashboard
            loadingState.style.display = 'none';
            dashboardContent.style.display = 'block';
            
            // Update user information
            document.getElementById('user-name').textContent = user.displayName || 'Bioline User';
            document.getElementById('user-email').textContent = user.email || 'No email provided';
            
            // Format the join date
            const joinDate = new Date(user.metadata.creationTime || Date.now());
            const formattedDate = joinDate.toLocaleDateString('ro-RO');
            document.getElementById('user-since').textContent = `Member since: ${formattedDate}`;
            
            // Set user avatar if available
            if (user.photoURL) {
                document.getElementById('user-avatar').src = user.photoURL;
            }
            
            // Fetch user data from Firebase
           // Fetch user data from Firebase
    const db = firebase.firestore();
    db.collection("users").doc(user.uid).get()
    .then((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            
            // Update the username from the database
            document.getElementById('user-name').textContent = userData.username || 'Bioline User';
            
            // Update progress containers
            updateProgressContainers(userData);
        } else {
            console.log("No user data found!");
        }
    })
    .catch((error) => {
        console.error("Error getting user data:", error);
    });
            // Set up the logout button
            document.getElementById('logout-button').addEventListener('click', function() {
                firebase.auth().signOut().then(function() {
                    // Sign-out successful, redirect to home
                    window.location.href = 'homepage.html';
                }).catch(function(error) {
                    // An error happened during sign out
                    console.error('Sign out error:', error);
                    alert('Error signing out. Please try again.');
                });
            });
            
        } else {
            // User is not logged in, show error
            loadingState.style.display = 'none';
            errorMessage.style.display = 'block';
            
            // Redirect after a delay
            setTimeout(function() {
                window.location.href = 'homepage.html';
            }, 3000);
        }
    });
    
    // Function to update progress containers based on user data
    function updateProgressContainers(userData) {
        // Clear existing modules
        progressModules.innerHTML = '';
        
        // Define our 4 progress containers
        const containers = [
            {
                title: "Lecții Mușchi",
                progress: calculateProgressPercentage(userData.muschiiLessonProgress, userData.muschiiLessonsTotal)
            },
            {
                title: "Lecții Schelet", 
                progress: calculateProgressPercentage(userData.scheletLessonProgress, userData.scheletLessonsTotal)
            },
            {
                title: "Teste Mușchi",
                progress: userData.muschiiTests * 10 // Assuming tests are scored 0-10, multiply by 10 for percentage
            },
            {
                title: "Teste Schelet",
                progress: userData.scheletTests * 10 // Assuming tests are scored 0-10, multiply by 10 for percentage
            }
        ];
        
        // Create a module card for each container
        containers.forEach(container => {
            const moduleCard = document.createElement('div');
            moduleCard.className = 'module-card';
            moduleCard.innerHTML = `
                <div class="module-title">${container.title}</div>
                <div class="module-progress">
                    <div class="progress-bar" style="width: ${container.progress}%;"></div>
                </div>
                <div class="module-status">${container.progress}% complete</div>
            `;
            
            progressModules.appendChild(moduleCard);
        });
    }
    
    // Helper function to calculate percentage
    function calculateProgressPercentage(progress, total) {
        if (!progress || !total || total === 0) return 0;
        return Math.min(100, Math.round((progress / total) * 100));
    }
});