async function initializeQuestions() {
  const questions = [
    {
      question: "Care este organul cel mai mare din corpul uman?",
      options: ["Pielea", "Ficatul", "Plămânii", "Intestinul gros"],
      correctAnswer: "Pielea",
      category: "anatomy"
    },
    {
      question: "Care sunt principalele funcții ale ficatului?", 
      options: [
        "Detoxifierea și producerea bilei",
        "Respirația și circulația",
        "Digestia și absorbția",
        "Filtrarea sângelui și urina"
      ],
      correctAnswer: "Detoxifierea și producerea bilei",
      category: "anatomy"
    },
    {
      question: "Câte camere are inima umană?",
      options: ["2", "3", "4", "6"],
      correctAnswer: "4", 
      category: "anatomy"
    },
    {
      question: "Ce tip de țesut este sângele?",
      options: [
        "Țesut conjunctiv",
        "Țesut epitelial", 
        "Țesut muscular",
        "Țesut nervos"
      ],
      correctAnswer: "Țesut conjunctiv",
      category: "anatomy"
    },
    {
      question: "Care este cel mai mic os din corpul uman?",
      options: [
        "Scărița din urechea internă",
        "Falanga degetului mic",
        "Osul nazal",
        "Vertebra C1"
      ],
      correctAnswer: "Scărița din urechea internă",
      category: "anatomy"
    }
  ];

  try {
    const db = firebase.firestore();
    const batch = db.batch();

    questions.forEach((question) => {
      const docRef = db.collection('questions').doc();
      batch.set(docRef, question);
    });

    await batch.commit();
    console.log('Questions initialized successfully!');
    alert('Questions have been added to the database!');
  } catch (error) {
    console.error('Error initializing questions:', error);
    alert('Error adding questions: ' + error.message);
  }
}