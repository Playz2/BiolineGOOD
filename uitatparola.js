// Firebase Configurations are already initialized in firebase-config.js
const emailInput = document.getElementById("email");
const form = document.getElementById("signin-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = emailInput.value;

    if (email) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                alert("A reset link has been sent to your email.");
                window.location.href = "homepage.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === 'auth/invalid-email') {
                    alert("Invalid email address.");
                } else if (errorCode === 'auth/user-not-found') {
                    alert("No user found with that email address.");
                } else {
                    alert("Error: " + errorMessage);
                }
            });
    } else {
        alert("Please enter your email address.");
    }
});
