
const video = document.getElementById("ske");
const videoToggle = document.getElementById("videoToggle");

videoToggle.addEventListener("click", () => {
    if (video.paused) {
        video.play();
        videoToggle.textContent = "⏸ Pause";
    } else {
        video.pause();
        videoToggle.textContent = "▶ Play";
    }
});



function startTimer(duration) {
    let time = duration;
    const timerElement = document.getElementById("timer");

    const interval = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? "0" + seconds : seconds; 

        timerElement.textContent = `⏳ ${minutes}:${seconds}`;

        if (time <= 0) {
            clearInterval(interval);
            timerElement.textContent = "⏳ Time's up!";
        }
        time--;
    }, 1000);
}

startTimer(600);


function checkMatching1() {
    const answers = { "match1": "B", "match2": "A", "match3": "C", "match4": "D" };
    for (let key in answers) {
        let input = document.getElementById(key);
        if (input.value.toUpperCase() === answers[key]) {
            input.style.backgroundColor = "lightgreen";
        } else {
            input.style.backgroundColor = "lightcoral";
        }
    }
}
function checkMatching2() {
    const answers = { "match5": "B", "match6": "A", "match7": "C", "match8": "D" };
    for (let key in answers) {
        let input = document.getElementById(key);
        if (input.value.toUpperCase() === answers[key]) {
            input.style.backgroundColor = "lightgreen";
        } else {
            input.style.backgroundColor = "lightcoral";
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const verificaButtons = document.querySelectorAll(".verifca");

    verificaButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const questionBlock = this.parentElement;
            const answers = questionBlock.querySelectorAll(".rasr");
            const correctAnswer = questionBlock.querySelector(".rasr[data-correct]");
            let selectedAnswer = questionBlock.querySelector(".rasr.selected");

            if (!selectedAnswer) return; 

            
            
            const correctLetter = correctAnswer.getAttribute("data-correct");  
            const selectedLetter = selectedAnswer.textContent.trim().charAt(0);
            

            if (selectedLetter === correctLetter) {
                selectedAnswer.classList.add("correct"); 
            } else {
                selectedAnswer.classList.add("incorrect");
                correctAnswer.classList.add("correct"); 
            }
        });
    });

    // Handle selection of answers
    const allAnswers = document.querySelectorAll(".rasr");
    allAnswers.forEach((answer) => {
        answer.addEventListener("click", function () {
            const questionBlock = this.closest(".cutie"); 
            const answers = questionBlock.querySelectorAll(".rasr");

            // Remove previous selection
            answers.forEach((ans) => ans.classList.remove("selected"));

            // Highlight selected answer
            this.classList.add("selected");
        });
    });
});
let correctAnswers = 0;
const totalQuestions = 10;
const totalElement = document.getElementById("total");

// Update the total display
function updateTotal() {
    totalElement.textContent = `${correctAnswers}/${totalQuestions}`;
}

// Initialize with 0/10
updateTotal();

// Matching question functions (existing code with score tracking added)
function checkMatching1() {
    const answers = { "match1": "B", "match2": "A", "match3": "C", "match4": "D" };
    let allCorrect = true;
    
    for (let key in answers) {
        let input = document.getElementById(key);
        if (input.value.toUpperCase() === answers[key]) {
            input.style.backgroundColor = "lightgreen";
        } else {
            input.style.backgroundColor = "lightcoral";
            allCorrect = false;
        }
    }
    
    // Only count as correct if all matches are correct and it hasn't been counted before
    if (allCorrect && !document.querySelector('.matching1-checked')) {
        correctAnswers++;
        updateTotal();
        // Mark this question as already checked
        const matchingContainer = document.getElementById("match1").closest('.cutie2');
        matchingContainer.classList.add('matching1-checked');
    }
}

function checkMatching2() {
    const answers = { "match5": "A", "match6": "B", "match7": "C", "match8": "D" };
    let allCorrect = true;
    
    for (let key in answers) {
        let input = document.getElementById(key);
        if (input.value.toUpperCase() === answers[key]) {
            input.style.backgroundColor = "lightgreen";
        } else {
            input.style.backgroundColor = "lightcoral";
            allCorrect = false;
        }
    }
    
    // Only count as correct if all matches are correct and it hasn't been counted before
    if (allCorrect && !document.querySelector('.matching2-checked')) {
        correctAnswers++;
        updateTotal();
        // Mark this question as already checked
        const matchingContainer = document.getElementById("match5").closest('.cutie2');
        matchingContainer.classList.add('matching2-checked');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const verificaButtons = document.querySelectorAll(".verifca");

    verificaButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const questionBlock = this.parentElement;
            const answers = questionBlock.querySelectorAll(".rasr");
            const correctAnswer = questionBlock.querySelector(".rasr[data-correct]");
            let selectedAnswer = questionBlock.querySelector(".rasr.selected");

            if (!selectedAnswer) return; 
            
            // Check if this question has already been graded
            if (questionBlock.classList.contains('graded')) {
                return;
            }
            
            const correctLetter = correctAnswer.getAttribute("data-correct");  
            const selectedLetter = selectedAnswer.textContent.trim().charAt(0);
            
            if (selectedLetter === correctLetter) {
                selectedAnswer.classList.add("correct");
                correctAnswers++;
                updateTotal();
            } else {
                selectedAnswer.classList.add("incorrect");
                correctAnswer.classList.add("correct"); 
            }
            
            // Mark this question as graded so it can't be counted twice
            questionBlock.classList.add('graded');
        });
    });

    // Handle selection of answers
    const allAnswers = document.querySelectorAll(".rasr");
    allAnswers.forEach((answer) => {
        answer.addEventListener("click", function () {
            const questionBlock = this.closest(".cuti1"); 
            const answers = questionBlock.querySelectorAll(".rasr");

            // Remove previous selection
            answers.forEach((ans) => ans.classList.remove("selected"));

            // Highlight selected answer
            this.classList.add("selected");
        });
    });
    
    // Confetti effect when test is finished
    const terminaButton = document.getElementById("termin");
    terminaButton.addEventListener("click", function() {
        showResults();
    });
});

// Confetti effect function
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    document.body.appendChild(confettiContainer);

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.top = '-20px';
        confetti.style.left = Math.random() * 100 + 'vw';
        confettiContainer.appendChild(confetti);

        const duration = Math.random() * 3 + 2;
        const xMovement = (Math.random() - 0.5) * 20;
        
        confetti.animate(
            [
                { transform: `translate(0, 0) rotate(0deg)` },
                { transform: `translate(${xMovement}vw, 100vh) rotate(${Math.random() * 360}deg)` }
            ],
            {
                duration: duration * 1000,
                easing: 'cubic-bezier(0, 1, 0.9, 1)'
            }
        );
        
        // Remove confetti after animation is complete
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
    
    // Remove the container after all confetti are done
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

// Show results with modal and confetti
function showResults() {
    // Create modal to show results
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '40px';
    modal.style.borderRadius = '10px';
    modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    modal.style.zIndex = '10000';
    modal.style.textAlign = 'center';
    
    // Calculate percentage score
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    // Add content to modal
    modal.innerHTML = `
        <h2>Test complet!</h2>
        <p style="font-size: 24px; margin: 20px 0;">Ai răspuns corect la <strong>${correctAnswers}</strong> din <strong>${totalQuestions}</strong> întrebări</p>
        <p style="font-size: 32px; font-weight: bold; color: ${percentage >= 60 ? 'green' : 'red'};">${percentage}%</p>
        <button id="closeModal" style="padding: 10px 20px; background-color: #249dff; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;">Închide</button>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when button is clicked
    document.getElementById('closeModal').addEventListener('click', function() {
        modal.remove();
    });
    
    // Show confetti effect
    createConfetti();
}