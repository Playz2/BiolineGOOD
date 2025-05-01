document.addEventListener('DOMContentLoaded', () => {
    const signupButtonDiv = document.querySelector('.signup-btn').parentElement; // Parent of the Sign Up button
    const userIconDiv = document.getElementById('user-icon');

    // Listen for changes to the user's authentication state
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        userIconDiv.style.display = 'block'; // Show the user icon
        signupButtonDiv.style.display = 'none'; // Hide the Sign Up button
      } else {
        // User is not signed in
        userIconDiv.style.display = 'none'; // Hide the user icon
        signupButtonDiv.style.display = 'block'; // Show the Sign Up button
      }
    });
  });