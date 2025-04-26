// Assuming Firebase is initialized already

const googleLoginBtn = document.getElementById('google-login');

googleLoginBtn.addEventListener('click', async () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    const result = await firebase.auth().signInWithPopup(provider);
    const user = result.user;
    console.log("User logged in:", user);

    // Optional: Save user info to Firestore if needed
    const userRef = firebase.firestore().collection('users').doc(user.uid);
    await userRef.set({
      name: user.displayName,
      email: user.email,
      scheletTests: 0,
      scheletTotal: 6,
      muschiiTests: 0,
      muschiiTotal: 6
    }, { merge: true });

    // Redirect to home page
    window.location.href = "index.html";
  } catch (error) {
    console.error("Google sign-in error:", error);
    alert("Something went wrong with Google sign-in.");
  }
});
