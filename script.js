// ================= DOM ELEMENTS =================
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const exitBtn = document.getElementById("exit-btn"); // ✅ NEW

const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

const timerText = document.getElementById("timer-text");
const timerCircle = document.querySelector(".timer-circle");

const finalScore = document.getElementById("final-score");
const performanceMessage = document.getElementById("performance-message");

const highScoreDisplay = document.getElementById("high-score-display");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// ================= STATE =================
let questionPool = [];
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let timeLeft = 15;
let selected = false;

// ================= QUESTION POOL =================
questionPool = [
    { question: "What is HTML?", options: ["Programming Language","Markup Language","Database","OS"], answer: "Markup Language" },
    { question: "CSS stands for?", options: ["Color Style Sheets","Cascading Style Sheets","Computer Style","Creative Style"], answer: "Cascading Style Sheets" },
    { question: "JS is used for?", options: ["Styling","Structure","Logic","Database"], answer: "Logic" },
    { question: "Which tag creates link?", options: ["<a>","<link>","<href>","<url>"], answer: "<a>" },
    { question: "Which property sets color?", options: ["text-color","font-color","color","bgcolor"], answer: "color" },
    { question: "Largest heading?", options: ["<h6>","<h1>","<head>","<title>"], answer: "<h1>" },
    { question: "Modern layout?", options: ["float","grid","table","inline"], answer: "grid" },
    { question: "JS framework?", options: ["React","Django","Flask","Laravel"], answer: "React" },
    { question: "Declare variable?", options: ["int","var","let","Both var & let"], answer: "Both var & let" },
    { question: "Console output?", options: ["print()","echo()","console.log()","write()"], answer: "console.log()" },
    { question: "Frontend tech?", options: ["Node","React","MongoDB","Express"], answer: "React" },
    { question: "Backend tech?", options: ["HTML","CSS","Node.js","Bootstrap"], answer: "Node.js" },
    { question: "Browser storage?", options: ["localStorage","sessionStorage","cookies","All"], answer: "All" },
    { question: "CSS id selector?", options: [".","#","*","&"], answer: "#" },
    { question: "Correct JS syntax?", options: ["printf()","console.log()","echo()","print()"], answer: "console.log()" },

    // extra pool
    { question: "Which company created JavaScript?", options: ["Microsoft","Netscape","Google","Apple"], answer: "Netscape" },
    { question: "Which HTML tag for image?", options: ["<img>","<image>","<src>","<pic>"], answer: "<img>" },
    { question: "Which CSS unit is relative?", options: ["px","em","cm","mm"], answer: "em" },
    { question: "Which event runs on click?", options: ["onhover","onclick","onchange","onload"], answer: "onclick" },
    { question: "Which loop in JS?", options: ["for","repeat","loop","iterate"], answer: "for" },
    { question: "Which is array method?", options: ["push()","add()","insert()","append()"], answer: "push()" },
    { question: "Which is NOT data type?", options: ["String","Boolean","Float","Undefined"], answer: "Float" },
    { question: "Which keyword constant?", options: ["var","let","const","static"], answer: "const" },
    { question: "Which CSS property margin?", options: ["space","margin","gap","padding"], answer: "margin" },
    { question: "Which is responsive?", options: ["fixed px","media queries","table","inline"], answer: "media queries" }
];

// ================= SHUFFLE =================
function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// ================= GENERATE QUESTIONS =================
function generateQuestions() {
    const shuffled = shuffleArray([...questionPool]);
    questions = shuffled.slice(0, 15);
}

// ================= START QUIZ =================
startBtn.addEventListener("click", () => {
    generateQuestions();

    currentQuestionIndex = 0;
    score = 0;

    welcomeScreen.classList.remove("active");
    resultScreen.classList.remove("active");
    quizScreen.classList.add("active");

    loadQuestion();
});

// ================= LOAD QUESTION =================
function loadQuestion() {
    resetState();

    const current = questions[currentQuestionIndex];

    questionText.textContent = current.question;

    progressText.textContent = `Question ${currentQuestionIndex + 1} of 15`;
    progressFill.style.width = `${(currentQuestionIndex / 15) * 100}%`;

    const shuffledOptions = shuffleArray([...current.options]);

    shuffledOptions.forEach(option => {
        const div = document.createElement("div");
        div.classList.add("option");
        div.textContent = option;

        div.addEventListener("click", () => selectOption(div, option));

        optionsContainer.appendChild(div);
    });

    startTimer();
}

// ================= RESET =================
function resetState() {
    nextBtn.disabled = true;
    optionsContainer.innerHTML = "";
    selected = false;
    clearInterval(timer);

    timeLeft = 15;
    timerText.textContent = timeLeft;
    timerCircle.classList.remove("timer-warning");
}

// ================= SELECT =================
function selectOption(element, option) {
    if (selected) return;
    selected = true;

    const correct = questions[currentQuestionIndex].answer;

    document.querySelectorAll(".option").forEach(opt => {
        opt.classList.remove("selected");
    });

    element.classList.add("selected");

    if (option === correct) {
        element.classList.add("correct");
        score++;
    } else {
        element.classList.add("incorrect");
        highlightCorrect(correct);
    }

    nextBtn.disabled = false;
    clearInterval(timer);
}

// ================= HIGHLIGHT =================
function highlightCorrect(answer) {
    document.querySelectorAll(".option").forEach(opt => {
        if (opt.textContent === answer) {
            opt.classList.add("correct");
        }
    });
}

// ================= TIMER (AUTO SKIP ADDED) =================
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;

        if (timeLeft <= 5) {
            timerCircle.classList.add("timer-warning");
        }

        if (timeLeft <= 0) {
            clearInterval(timer);

            highlightCorrect(questions[currentQuestionIndex].answer);

            setTimeout(() => {
                currentQuestionIndex++;

                if (currentQuestionIndex < 15) {
                    loadQuestion();
                } else {
                    showResult();
                }
            }, 800);
        }
    }, 1000);
}

// ================= NEXT =================
nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < 15) {
        loadQuestion();
    } else {
        showResult();
    }
});

// ================= EXIT =================
if (exitBtn) {
    exitBtn.addEventListener("click", () => {
        const confirmExit = confirm("Are you sure you want to exit the quiz?");
        if (!confirmExit) return;

        clearInterval(timer);

        currentQuestionIndex = 0;
        score = 0;

        quizScreen.classList.remove("active");
        welcomeScreen.classList.add("active");
    });
}

// ================= RESULT =================
function showResult() {
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    finalScore.textContent = score;

    let msg = "";
    if (score >= 12) msg = "🔥 Excellent!";
    else if (score >= 8) msg = "👍 Good Job!";
    else msg = "📘 Keep Practicing!";

    performanceMessage.textContent = msg;

    let high = localStorage.getItem("highScore") || 0;
    if (score > high) {
        localStorage.setItem("highScore", score);
        high = score;
    }

    highScoreDisplay.textContent = `High Score: ${high}`;
}

// ================= RESTART =================
restartBtn.addEventListener("click", () => {
    resultScreen.classList.remove("active");
    welcomeScreen.classList.add("active");
});

// ================= DARK MODE =================
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});