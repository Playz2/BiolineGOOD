document.addEventListener('DOMContentLoaded', function() {
    const loadingState = document.getElementById('loading-state');
    const errorMessage = document.getElementById('error-message');
    const dashboardContent = document.getElementById('dashboard-content');
    
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
            
            // Set up the edit profile button (placeholder for now)
            document.getElementById('edit-profile').addEventListener('click', function() {
                alert('Profile editing functionality will be implemented here.');
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
});