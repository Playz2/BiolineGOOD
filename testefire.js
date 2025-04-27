// testefire.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("Test tracking script loaded");
    
    // Define test arrays
    const scheletTests = ["test1s", "test2s", "test3s", "test4s", "test5s", "test6s"];
    const muschiTests = ["test1m", "test2m", "test3m", "test4m", "test5m", "test6m"];

    // Add click event listeners to all test links
    [...scheletTests, ...muschiTests].forEach(testId => {
        const element = document.getElementById(testId);
        if (element) {
            console.log(`Found test element: ${testId}`);
            
            element.addEventListener('click', (event) => {
                // Prevent immediate navigation
                event.preventDefault();
                
                console.log(`Test clicked: ${testId}`);
                const testUrl = element.getAttribute('href');
                
                // Check authentication and update progress
                firebase.auth().onAuthStateChanged(async (user) => {
                    if (user) {
                        console.log(`User authenticated: ${user.uid}`);
                        const userRef = firebase.firestore().collection('users').doc(user.uid);
                        
                        try {
                            const userSnap = await userRef.get();
                            
                            if (userSnap.exists) {
                                const userData = userSnap.data();
                                let updated = false;
                                
                                // Handle Schelet tests
                                if (scheletTests.includes(testId)) {
                                    const testsArray = userData.tests || [];
                                    
                                    if (!testsArray.includes(testId)) {
                                        console.log(`Adding ${testId} to schelet tests`);
                                        await userRef.update({
                                            tests: firebase.firestore.FieldValue.arrayUnion(testId),
                                            scheletTests: (userData.scheletTests || 0) + 1
                                        });
                                        updated = true;
                                    } else {
                                        console.log(`${testId} already in schelet tests`);
                                    }
                                }
                                
                                // Handle Muschi tests
                                if (muschiTests.includes(testId)) {
                                    const testsArray = userData.testm || [];
                                    
                                    if (!testsArray.includes(testId)) {
                                        console.log(`Adding ${testId} to muschi tests`);
                                        await userRef.update({
                                            testm: firebase.firestore.FieldValue.arrayUnion(testId),
                                            muschiiTests: (userData.muschiiTests || 0) + 1
                                        });
                                        updated = true;
                                    } else {
                                        console.log(`${testId} already in muschi tests`);
                                    }
                                }
                                
                                if (updated) {
                                    console.log(`Updated progress for test: ${testId}`);
                                }
                            }
                        } catch (error) {
                            console.error("Error updating test data:", error);
                        }
                        
                        // Navigate to test page after updating
                        console.log(`Navigating to: ${testUrl}`);
                        window.location.href = testUrl;
                    } else {
                        console.log("User not logged in");
                        // Optional: Show login message
                        alert("Trebuie să te autentifici pentru a accesa testele");
                        // You could redirect to login page:
                        // window.location.href = "login.html";
                    }
                });
            });
        } else {
            console.log(`Test element not found: ${testId}`);
        }
    });
});