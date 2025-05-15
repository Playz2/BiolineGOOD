const loadingContainer = document.getElementById('loadingContainer');
        const gameContainer = document.getElementById('gameContainer');
        const resultsContainer = document.getElementById('resultsContainer');
        const player1Name = document.getElementById('player1Name');
        const player2Name = document.getElementById('player2Name');
        const player1Status = document.getElementById('player1Status');
        const player2Status = document.getElementById('player2Status');
        const player1Card = document.getElementById('player1Card');
        const player2Card = document.getElementById('player2Card');
        const currentQuestionNum = document.getElementById('currentQuestionNum');
        const totalQuestions = document.getElementById('totalQuestions');
        const progressBar = document.getElementById('progressBar');
        const categoryTag = document.getElementById('categoryTag');
        const questionText = document.getElementById('questionText');
        const optionsContainer = document.getElementById('optionsContainer');
        const nextBtn = document.getElementById('nextBtn');
        const winnerAnnouncement = document.getElementById('winnerAnnouncement');
        const player1Score = document.getElementById('player1Score');
        const player2Score = document.getElementById('player2Score');
        const returnLobbyBtn = document.getElementById('returnLobbyBtn');
        const feedbackMessage = document.getElementById('feedbackMessage');
        const timerElement = document.getElementById('timer');
        const player1Result = document.getElementById('player1Result');
        const player2Result = document.getElementById('player2Result');
        
        // Variables
        let currentUser = null;
        let gameId = null;
        let gameData = null;
        let currentQuestionIndex = 0;
        let questions = [];
        let userAnswers = [];
        let players = {};
        let opponentId = null;
        let gameUnsubscribe = null;
        let timeLeft = 20;
        let timerInterval = null;
        
        // Get game ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        gameId = urlParams.get('gameId');
        
        if (!gameId) {
            alert("No game ID provided. Redirecting to lobby.");
            window.location.href = "match.html";
        }
        
        // Auth state observer
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in
                currentUser = user;
                initializeGame();
            } else {
                // User is signed out
                alert("You need to be signed in to play. Redirecting to lobby.");
                window.location.href = "match.html";
            }
        });
        
        // Initialize the game
        async function initializeGame() {
            try {
                // Get game data
                const gameDocRef = firebase.firestore().collection("games").doc(gameId);
                const gameSnapshot = await gameDocRef.get();
                
                if (!gameSnapshot.exists) {
                    alert("Game not found. Redirecting to lobby.");
                    window.location.href = "match.html";
                    return;
                }
                
                gameData = gameSnapshot.data();
                questions = gameData.questions;
                players = gameData.players;
                
                // Process questions to add correctIndex based on correctAnswer
                questions = questions.map(question => {
                    const correctIndex = question.options.findIndex(
                        option => option === question.correctAnswer
                    );
                    return {
                        ...question,
                        correctIndex: correctIndex
                    };
                });
                
                // Set up game UI
                setupGame();
                
                // Show the game container
                loadingContainer.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                
                // Listen for game updates
                setupGameListener();
            } catch (error) {
                console.error("Error initializing game:", error);
                alert("Error loading game: " + error.message);
                window.location.href = "match.html";
            }
        }
        
        // Set up the game UI
        function setupGame() {
            // Find opponent
            const playerIds = Object.keys(players);
            opponentId = playerIds.find(id => id !== currentUser.uid);
            
            // Set player names
            player1Name.textContent = players[currentUser.uid].displayName || "You";
            player2Name.textContent = players[opponentId].displayName || "Opponent";
            
            // Set total questions
            totalQuestions.textContent = questions.length;
            
            // Show first question
            showQuestion(0);
        }
        
        // Show a question
        function showQuestion(index) {
            if (index >= questions.length) {
                // End of quiz
                finishQuiz();
                return;
            }
            
            // Reset timer
            clearInterval(timerInterval);
            timeLeft = 20;
            updateTimer();
            startTimer();
            
            // Reset feedback message
            feedbackMessage.classList.add('hidden');
            
            // Update progress
            currentQuestionIndex = index;
            currentQuestionNum.textContent = index + 1;
            progressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
            
            // Get current question
            const question = questions[index];
            
            // Display question
            questionText.textContent = question.question;
            
            // Display category
            categoryTag.textContent = question.category || 'Biology';
            
            // Clear options
            optionsContainer.innerHTML = '';
            
            // Add options
            question.options.forEach((option, i) => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.innerHTML = `<span class="option-label">${option}</span>`;
                button.dataset.index = i;
                button.addEventListener('click', () => selectOption(i));
                optionsContainer.appendChild(button);
            });
            
            // Hide next button
            nextBtn.classList.add('hidden');
        }
        
        // Timer functions
        function updateTimer() {
            timerElement.textContent = `Time: ${timeLeft}s`;
            if (timeLeft <= 5) {
                timerElement.style.color = 'var(--incorrect-color)';
            } else {
                timerElement.style.color = 'var(--timer-color)';
            }
        }
        
        function startTimer() {
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimer();
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    // Auto-select a random wrong answer if timer runs out
                    const currentQuestion = questions[currentQuestionIndex];
                    let randomWrongIndex;
                    
                    do {
                        randomWrongIndex = Math.floor(Math.random() * currentQuestion.options.length);
                    } while (randomWrongIndex === currentQuestion.correctIndex);
                    
                    selectOption(randomWrongIndex);
                }
            }, 1000);
        }
        
        // Create floating emoji animation
        function createFloatingEmoji(emoji, x, y) {
            const emojiElement = document.createElement('div');
            emojiElement.className = 'floating-emoji';
            emojiElement.textContent = emoji;
            emojiElement.style.left = `${x}px`;
            emojiElement.style.top = `${y}px`;
            document.body.appendChild(emojiElement);
            
            setTimeout(() => {
                document.body.removeChild(emojiElement);
            }, 2000);
        }
        
        // Select an option
        async function selectOption(optionIndex) {
            // Clear timer
            clearInterval(timerInterval);
            
            // Prevent selecting multiple options
            const optionButtons = optionsContainer.querySelectorAll('.option-btn');
            optionButtons.forEach(button => {
                button.classList.add('disabled');
                button.removeEventListener('click', selectOption);
            });
            
            // Get current question
            const question = questions[currentQuestionIndex];
            
            // Highlight selected option
            const selectedButton = optionsContainer.querySelector(`[data-index="${optionIndex}"]`);
            selectedButton.classList.add('selected');
            
            // Check if answer is correct
            const isCorrect = optionIndex === question.correctIndex;
            
            // Show correct and incorrect answers
            setTimeout(() => {
                // Update feedback message
                feedbackMessage.textContent = isCorrect ? 
                    "Corecta! Bravo! 👍" : 
                    `Incorrect. Răspunsul corect este: ${question.options[question.correctIndex]} 😕`;
                feedbackMessage.className = `feedback-message ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
                feedbackMessage.classList.remove('hidden');
                
                // Create floating emojis
                const rect = selectedButton.getBoundingClientRect();
                const x = rect.left + (rect.width / 2);
                const y = rect.top;
                
                if (isCorrect) {
                    createFloatingEmoji('✅', x, y);
                } else {
                    createFloatingEmoji('❌', x, y);
                }
                
                optionButtons.forEach(button => {
                    const index = parseInt(button.dataset.index);
                    if (index === question.correctIndex) {
                        button.classList.add('correct');
                    } else if (index === optionIndex && !isCorrect) {
                        button.classList.add('incorrect');
                    }
                });
                
                // Save answer to userAnswers
                userAnswers.push({
                    questionIndex: currentQuestionIndex,
                    selectedOption: optionIndex,
                    isCorrect: isCorrect
                });
                
                // Update player's answers in Firestore
                updatePlayerAnswers(currentQuestionIndex, optionIndex, isCorrect);
                
                // Show next button
                nextBtn.classList.remove('hidden');
            }, 500);
        }
        
        // Update player's answers in Firestore
        async function updatePlayerAnswers(questionIndex, optionIndex, isCorrect) {
            try {
                const gameDocRef = firebase.firestore().collection("games").doc(gameId);
                
                // Calculate current score
                const score = userAnswers.filter(answer => answer.isCorrect).length;
                
                // Update player data in Firestore
                await gameDocRef.update({
                    [`players.${currentUser.uid}.answers`]: firebase.firestore.FieldValue.arrayUnion({
                        questionIndex: questionIndex,
                        selectedOption: optionIndex,
                        isCorrect: isCorrect
                    }),
                    [`players.${currentUser.uid}.score`]: score
                });
                
                // If this is the last question, mark player as completed
                if (questionIndex === questions.length - 1) {
                    await gameDocRef.update({
                        [`players.${currentUser.uid}.completed`]: true
                    });
                }
            } catch (error) {
                console.error("Error updating answers:", error);
            }
        }
        
        // Next question button handler
        nextBtn.addEventListener('click', () => {
            showQuestion(currentQuestionIndex + 1);
        });
        
        // Finish quiz
        function finishQuiz() {
            clearInterval(timerInterval);
            player1Status.textContent = "Completed";
            
            // Wait for opponent to finish
            if (!players[opponentId] || !players[opponentId].completed) {
                questionText.textContent = "Așteptând ca adversarul să termine...";
                categoryTag.textContent = "Test completat";
                optionsContainer.innerHTML = '';
                nextBtn.classList.add('hidden');
                feedbackMessage.classList.add('hidden');
            } else {
                showResults();
            }
        }
        
        // Show quiz results
        function showResults() {
            gameContainer.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
            
            const userScore = players[currentUser.uid].score || 0;
            const opponentScore = players[opponentId].score || 0;
            
            player1Score.textContent = userScore;
            player2Score.textContent = opponentScore;
            
            // Highlight the winner
            if (userScore > opponentScore) {
                winnerAnnouncement.textContent = "🏆 Felicitări! Ai câștigat! 🏆";
                player1Result.classList.add('winner');
            } else if (opponentScore > userScore) {
                winnerAnnouncement.textContent = "Ai pierdut. Mai mult noroc data viitoare!";
                player2Result.classList.add('winner');
            } else {
                winnerAnnouncement.textContent = "It's a tie!";
            }
        }
        
        // Return to lobby button handler
        returnLobbyBtn.addEventListener('click', () => {
            window.location.href = "match.html";
        });
        
        // Set up game listener for real-time updates
        function setupGameListener() {
            if (gameUnsubscribe) {
                gameUnsubscribe();
            }
            
            gameUnsubscribe = firebase.firestore().collection("games").doc(gameId)
                .onSnapshot((doc) => {
                    if (!doc.exists) {
                        alert("Jocul a fost șters. Redirecționare către lobby.");
                        window.location.href = "match.html";
                        return;
                    }
                    
                    const data = doc.data();
                    players = data.players;
                    
                    // Update opponent status
                    if (players[opponentId]) {
                        if (players[opponentId].completed) {
                            player2Status.textContent = "Completed";
                        } else if (players[opponentId].answers && players[opponentId].answers.length > 0) {
                            player2Status.textContent = `Answered ${players[opponentId].answers.length} of ${questions.length}`;
                        }
                    }
                    
                    // If both players completed, show results
                    if (players[currentUser.uid] && players[currentUser.uid].completed && 
                        players[opponentId] && players[opponentId].completed) {
                        showResults();
                    }
                });
        }
        
        // Clean up on page close
        window.addEventListener('beforeunload', () => {
            if (gameUnsubscribe) {
                gameUnsubscribe();
            }
            clearInterval(timerInterval);
        });