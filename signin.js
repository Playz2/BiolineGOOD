// Get the form elements
const form = document.getElementById("signin-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggle-password");

// Add event listener to handle form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();  // Prevent form from refreshing the page

    const email = emailInput.value;
    const password = passwordInput.value;

    if (email && password) {
        // Call Firebase Auth to sign in the user with email and password
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Successfully signed in
                const user = userCredential.user;
                console.log("Signed in as:", user.email);
                window.location.href = "homepage.html";  // Redirect to homepage
            })
            .catch((error) => {
                // Handle errors
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === 'auth/wrong-password') {
                    alert("Incorrect password.");
                } else if (errorCode === 'auth/user-not-found') {
                    alert("No user found with that email.");
                } else {
                    alert("Error: " + errorMessage);
                }
            });
    } else {
        alert("Please fill in both email and password.");
    }
});

// Toggle password visibility
togglePassword.addEventListener("click", () => {
    // Toggle the input type between 'password' and 'text'
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;

    // Optionally, change the eye icon based on the visibility of the password
    togglePassword.textContent = type === "password" ? "👁️" : "🙈"; // Change icon to closed eye when password is visible
});
