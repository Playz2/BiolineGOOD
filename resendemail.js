// Make sure Firebase is properly initialized in firebase-config.js before this code runs

document.addEventListener('DOMContentLoaded', function() {
    // Get the resend button
    const resendButton = document.querySelector('.resend-button');
    
    // Add click event listener to the resend button
    resendButton.addEventListener('click', function() {
        const user = firebase.auth().currentUser;
        
        if (user) {
            // Send verification email
            user.sendEmailVerification()
                .then(() => {
                    // Show success message
                    alert('Email-ul de verificare a fost retrimis cu succes!');
                })
                .catch((error) => {
                    // Handle errors
                    console.error('Eroare la retrimiterea email-ului:', error);
                    alert('A apărut o eroare la retrimiterea email-ului. Te rugăm să încerci din nou mai târziu.');
                });
        } else {
            // User is not signed in
            alert('Nu sunteți autentificat. Vă rugăm să vă autentificați pentru a primi un email de verificare.');
            // Optionally redirect to login page
            // window.location.href = 'login.html';
        }
    });

    // Check if user is already verified
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if (user.emailVerified) {
                // If email is already verified, you might want to redirect or update UI
                document.querySelector('h1').textContent = 'Email Verificat!';
                document.querySelector('h2').textContent = 'Contul tău a fost verificat cu succes.';
                document.querySelector('p').textContent = 'Poți continua să folosești platforma noastră.';
                resendButton.style.display = 'none';
            }
        }
    });
});