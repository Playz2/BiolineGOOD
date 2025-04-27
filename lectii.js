document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.pathname; // Get current page URL
    const filename = url.substring(url.lastIndexOf('/') + 1); // Get the filename (e.g., schelet-lesson-1.html)
    const lessonName = filename.replace('.html', ''); // Remove the '.html' part to get the lesson name (e.g., schelet, muschi)
    
    // Define arrays BEFORE using them
    const scheletLessons = ["schelet", "schelettip", "scheletcap", "schelettrunchi", "memsup", "scheletmeminf", "Rolpar", "rolpro", "rolsediu", "rolcompozitie", "articulati", "patologie"];
    const muschiLessons = ["fiziologie", "strct-musch", "cap", "gat", "mustrun", "mussup", "muschi membri inferiorm", "propietati", "Manifestarile", "patologiemuschi"];
    
    // Now check if the lesson is in either array
    const isScheletLesson = scheletLessons.includes(lessonName); // Check if it's a Schelet lesson
    const isMuschiLesson = muschiLessons.includes(lessonName); // Check if it's a Muschi lesson
    
    if (isScheletLesson || isMuschiLesson) {
      console.log(`Detected lesson: ${lessonName} - schelet: ${isScheletLesson}, muschi: ${isMuschiLesson}`);
      
      // Check if the user is authenticated
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const userRef = firebase.firestore().collection('users').doc(user.uid);
          const userSnap = await userRef.get();
  
          if (userSnap.exists) {
            const userData = userSnap.data();
            
            // Check if it's a Schelet lesson
            if (isScheletLesson) {
              const lessonsArray = userData.scheletLessonsEntered || [];
              
              // If the lesson hasn't been visited, add it to the array
              if (!lessonsArray.includes(lessonName)) {
                await userRef.update({
                  scheletLessonsEntered: firebase.firestore.FieldValue.arrayUnion(lessonName),
                  scheletLessonProgress: lessonsArray.length + 1 // Increase lesson progress count
                });
                console.log(`${lessonName} added to Schelet lessons. Progress: ${lessonsArray.length + 1}`);
              } else {
                console.log(`${lessonName} already visited in Schelet.`);
              }
            }
  
            // Check if it's a Muschi lesson
            if (isMuschiLesson) {
              const lessonsArray = userData.muschiiLessonsEntered || [];
              
              // If the lesson hasn't been visited, add it to the array
              if (!lessonsArray.includes(lessonName)) {
                await userRef.update({
                  muschiiLessonsEntered: firebase.firestore.FieldValue.arrayUnion(lessonName),
                  muschiiLessonProgress: lessonsArray.length + 1 // Increase lesson progress count
                });
                console.log(`${lessonName} added to Muschi lessons. Progress: ${lessonsArray.length + 1}`);
              } else {
                console.log(`${lessonName} already visited in Muschi.`);
              }
            }
          }
        } else {
          console.log("User not logged in.");
        }
      });
    } else {
      console.log(`Lesson ${lessonName} not found in lesson lists.`);
    }
  });