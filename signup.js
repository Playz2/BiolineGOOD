document.addEventListener('DOMContentLoaded', function() {
    // Reference to the signup form
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        // Handle form submission for signup
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission

            // Get user input
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Create user with email and password
            auth.createUserWithEmailAndPassword(email, password) // Corrected method name
                .then((userCredential) => {
                    // User created successfully
                    const user = userCredential.user;

                    // Send email verification
                    return user.sendEmailVerification().then(() => {
                        // Save additional user info (username) to Firestore
                        return db.collection('users').doc(user.uid).set({
                            username: username,
                            email: email,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    });
                })
                .then(() => {
                    // Redirect to verification page immediately
                    window.location.href = 'verification.html';

                    // Show success message (this will be displayed on the verification page)
                    localStorage.setItem('signupMessage', 'Account created successfully! Please check your email for verification.');
                })
                .catch((error) => {
                    // Handle errors
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    // Show error to user
                    showMessage('Error: ' + errorMessage, 'error');
                    console.error(errorCode, errorMessage);
                    
                });
                
        });
        
    }

    // Function to show messages to the user
    function showMessage(message, type) {
        // Create message element if it doesn't exist
        let messageDiv = document.getElementById('message-container');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'message-container';
            document.body.appendChild(messageDiv);
        }

        // Style the message based on type
        const messageClass = 'message ' + type;

        // Set the message content
        messageDiv.innerHTML = `<div class="${messageClass}">${message}</div>`;
        messageDiv.style.display = 'block';

        // Auto-hide the message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
});