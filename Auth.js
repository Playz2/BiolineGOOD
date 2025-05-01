document.addEventListener('DOMContentLoaded', () => {
  const authContent = document.getElementById('auth-content');

  if (typeof firebase !== 'undefined' && firebase.auth) {
    console.log("Firebase is initialized, listening for auth changes");

    // Listen for authentication state changes
    firebase.auth().onAuthStateChanged(user => {
      console.log("Auth state changed:", user ? "logged in" : "logged out");
      updateUIBasedOnAuth(user);
    });
  } else {
    console.log("Firebase not initialized, using test mode");
    // For testing without Firebase
    const isLoggedIn = false; // Set to true to test logged-in state
    if (isLoggedIn) {
      const mockUserData = {
        scheletTests: 2,
        scheletTotal: 6,
        muschiiTests: 1,
        muschiiTotal: 6
      };
      renderLoggedInUI(mockUserData);
    } else {
      renderLoggedOutUI();
    }
  }

  function updateUIBasedOnAuth(user) {
    if (user) {
      console.log("User is signed in, loading data for:", user.uid);
      loadUserTestData(user.uid).then(userData => {
        console.log("User data loaded:", userData);
        renderLoggedInUI(userData);
      }).catch(error => {
        console.error("Error loading user data:", error);
        const fallbackData = {
          scheletTests: 0,
          scheletTotal: 6,
          muschiiTests: 0,
          muschiiTotal: 6
        };
        renderLoggedInUI(fallbackData);
      });
    } else {
      console.log("No user is signed in");
      renderLoggedOutUI();
    }
  }

  function renderLoggedInUI(userData) {
    if (!authContent) {
      console.error("Auth content container not found");
      return;
    }

    console.log("Rendering logged-in UI");

    const data = {
      scheletTests: userData?.scheletTests || 0,
      scheletTotal: userData?.scheletTotal || 6,
      muschiiTests: userData?.muschiiTests || 0,
      muschiiTotal: userData?.muschiiTotal || 6
    };

    authContent.innerHTML = `
      <div class="progress-section">
        <div class="progress-card">
          <div class="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle class="progress-bg" cx="50" cy="50" r="40"></circle>
              <circle class="progress-bar" cx="50" cy="50" r="40" 
                stroke-dasharray="${calculateProgress(data.scheletTests, data.scheletTotal)} 251.2"></circle>
            </svg>
            <div class="progress-text">${data.scheletTests}/${data.scheletTotal}</div>
          </div>
          <h3 class="card-title">Teste rezolvate la sistemul osos</h3>
          <a href="exerciti.html" class="access-link">Acceseaza testele</a>
        </div>
        
        <div class="progress-card">
          <div class="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle class="progress-bg" cx="50" cy="50" r="40"></circle>
              <circle class="progress-bar" cx="50" cy="50" r="40" 
                stroke-dasharray="${calculateProgress(data.muschiiTests, data.muschiiTotal)} 251.2"></circle>
            </svg>
            <div class="progress-text">${data.muschiiTests}/${data.muschiiTotal}</div>
          </div>
          <h3 class="card-title">Test rezolvate la sistemul muscular </h3>
          <a href="exerciti.html" class="access-link">Acceseaza testele</a>
        </div>
      </div>
    `;

    authContent.style.display = 'block';
    authContent.style.opacity = '1';

    setTimeout(() => {
      const progCards = authContent.querySelectorAll('.progress-card');
      progCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.setProperty('--delay', index + 1);
      });
    }, 100);
  }

  function renderLoggedOutUI() {
    if (!authContent) {
      console.error("Auth content container not found");
      return;
    }

    console.log("Rendering logged-out UI");

    authContent.innerHTML = `
      <div class="progress-section">
        <div class="progress-card inactive">
          <div class="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle class="progress-bg" cx="50" cy="50" r="40"></circle>
              <circle class="progress-bar" cx="50" cy="50" r="40" stroke-dasharray="0 251.2"></circle>
            </svg>
            <div class="progress-text">0/6</div>
          </div>
          <h3 class="card-title">Test rezolvate la sistemul osos</h3>
          <a href="/tests/schelet" class="access-link">Mergi la teste de la sistemul osos</a>
        </div>
        
        <div class="progress-card inactive">
          <div class="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle class="progress-bg" cx="50" cy="50" r="40"></circle>
              <circle class="progress-bar" cx="50" cy="50" r="40" stroke-dasharray="0 251.2"></circle>
            </svg>
            <div class="progress-text">0/6</div>
          </div>
          <h3 class="card-title">Test rezolvate la sistemul muscular</h3>
          <a href="/tests/muschii" class="access-link">Mergi la teste de la sistemul muscular</a>
        </div>
      </div>
    `;

    authContent.style.display = 'block';

    const overlay = document.createElement('div');
    overlay.className = 'auth-overlay';

    overlay.innerHTML = `
      <div class="overlay-content">
        <p>Trebuie să te autentifici pentru a accesa testele</p>
        <a href="signup.html" class="login-button">Autentificare</a>
      </div>
    `;

    const signinSection = document.querySelector('.signin');
    if (signinSection) {
      signinSection.appendChild(overlay);
    }

    setTimeout(() => {
      const progCards = authContent.querySelectorAll('.progress-card');
      progCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.setProperty('--delay', index + 1);
      });

      setTimeout(() => {
        overlay.classList.add('fade-in');
      }, 300);
    }, 100);
  }

  // Load user test data from Firestore
  async function loadUserTestData(userId) {
    try {
      if (!firebase.firestore) {
        console.error("Firestore not available");
        return {
          scheletTests: 0,
          scheletTotal: 6,
          tests: [],
          muschiiTests: 0,
          muschiiTotal: 6,
          testm: [],
          scheletLessonsEntered: [],
          muschiiLessonsEntered: [],
          scheletLessonsTotal: 11,
          muschiiLessonsTotal: 11,
          scheletLessonProgress: 0,
          muschiiLessonProgress: 0
        };
      }
  
      const userRef = firebase.firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      const defaultData = {
        scheletTests: 0,
        scheletTotal: 6,
        tests: [],
        muschiiTests: 0,
        muschiiTotal: 6,
        testm: [],
        scheletLessonsEntered: [],
        muschiiLessonsEntered: [],
        scheletLessonsTotal: 11,
        muschiiLessonsTotal: 11,
        scheletLessonProgress: 0,
        muschiiLessonProgress: 0
      };
  
      if (userDoc.exists) {
        const userData = userDoc.data();
        const updatedData = { ...userData };
  
        // Check if fields are missing
        let needsUpdate = false;
        for (const key in defaultData) {
          if (!(key in userData)) {
            updatedData[key] = defaultData[key];
            needsUpdate = true;
          }
        }
  
        if (needsUpdate) {
          await userRef.update(updatedData);
          console.log("User data updated with missing fields:", updatedData);
        }
  
        return updatedData;
      } else {
        // Create new user document if doesn't exist
        await userRef.set(defaultData);
        return defaultData;
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      return {
        scheletTests: 0,
        scheletTotal: 6,
        tests: [],
        muschiiTests: 0,
        muschiiTotal: 6,
        testm: [],
        scheletLessonsEntered: [],
        muschiiLessonsEntered: [],
        scheletLessonsTotal: 11,
        muschiiLessonsTotal: 11,
        scheletLessonProgress: 0,
        muschiiLessonProgress: 0
      };
    }
  }
  
  // Calculate stroke-dasharray value for the progress circle
  function calculateProgress(current, total) {
    if (!current || !total || total === 0) return 0;
    const circumference = 2 * Math.PI * 40; // 2πr where r = 40
    return (current / total) * circumference;
  }
});
