var countdownEl = document.getElementById("countdown");
var startQuizBtn = document.getElementById("start-quiz-btn");
var questionEl = document.getElementById("current-question");
var answerBtns = document.querySelectorAll(".answer-btn");
var answerWrapper = document.getElementById("answers");
var feedbackEl = document.getElementById("feedback-value");
var formData = document.getElementById("user-form");
var initialsInput = document.getElementById("initials-input");
var currentScoreEl = document.getElementById("current-score");
var highScoresSection = document.getElementById("high-scores");
var goBackBtn = document.getElementById("go-back-btn");
var clearHighScores = document.getElementById("clear-high-score-btn");
var scoresWrapper = document.getElementById("scores-wrapper");
var viewHighScoresBtn = document.querySelector(".high-scores-btn");

// global variables
var highScores = [];
var currentScore = 0;
var totalCorrect = 0;
var countdown = 0;
var questionIndex = 0;
var quizStarted = false;

// New quiz object submitted at the end of the quiz
var newQuiz = {
  initials: "",
  score: 0,
};

// Array with question objects
var questions = [
  {
    question: "Commonly used data types DO NOT include:",
    answers: ["strings", "booleans", "alerts", "numbers"],
    correctAnswer: "alerts",
  },
  {
    question: "The condition in an if / else statement is enclosed with _____.",
    answers: ["quotes", "curly brakets", "parenthesis", "square brakets"],
    correctAnswer: "parenthesis",
  },
  {
    question: "Arrays in JavaScript can be used to store _____.",
    answers: [
      "numbers and strings",
      "other arrays",
      "booleans",
      "all of the above",
    ],
    correctAnswer: "all of the above",
  },
  {
    question:
      "String values must be enclosed within _____ when being assigned to variables.",
    answers: ["commas", "curly brakets", "quotes", "parenthesis"],
    correctAnswer: "quotes",
  },
  {
    question:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    answers: ["JavaScript", "termical/bash", "for loops", "console.log"],
    correctAnswer: "console.log",
  },
];

var updateCountdown = function () {
  countdownEl.textContent = countdown;
  if (countdown <= 0) {
    countdownEl.textContent = 0;
  }
};

var penalizeWrongAnswer = function () {
  countdown -= 10;
  updateCountdown();
};

// Hide or show sections based on two id's
var changeDisplay = function (showId, hideId) {
  if (showId !== null && showId !== undefined) {
    document.getElementById(showId).setAttribute("style", "display: flex;");
  }
  if (hideId !== null && hideId !== undefined) {
    document.getElementById(hideId).setAttribute("style", "display: none;");
  }
};

// Load new questions to page and remove previous ones
var loadQuestion = function () {
  if (questionIndex >= questions.length) {
    return;
  }
  var currentQuestion = questions[questionIndex];
  var answerBtns = document.querySelectorAll(".answer-btn");
  var answerIndex = 0;

  // Remove previous answer buttons
  if (answerBtns.length > 0) {
    answerWrapper.innerHTML = "";
  }

  // Update current html question h2
  questionEl.textContent = currentQuestion.question;

  // Create, add attributes, and append question buttons to answer element
  for (var i = 0; i < currentQuestion.answers.length; i++) {
    var currentAnswer = currentQuestion.answers[answerIndex];
    var correctAnswer = currentQuestion.correctAnswer;

    var newBtn = document.createElement("button");

    // Add attributes
    newBtn.setAttribute("class", "answer-btn");
    newBtn.setAttribute(
      "data-correct-answer",
      currentAnswer === correctAnswer ? "true" : "false"
    );
    newBtn.setAttribute("value", currentAnswer);
    newBtn.textContent = `${answerIndex + 1}. ${currentAnswer}`;
    answerWrapper.appendChild(newBtn);
    answerIndex++;
  }
};

// used .sort to order highscores: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
var sortHighScores = function () {
  highScores.sort(function (a, b) {
    if (a.score < b.score) {
      return 1;
    } else if (a.score > b.score) {
      return -1;
    }
  });
};

var clearScores = function () {
  highScores = [];
  scoresWrapper.innerHTML = "";
};

// Display each high score
var loadHighScores = function () {
  if (highScores.length > 0) {
    // Clear scores elements
    scoresWrapper.innerHTML = "";
    // Create new score elements
    sortHighScores();
    highScores.forEach(function (score, index) {
      var newScore = document.createElement("div");
      var indexEl = document.createElement("p");
      var initialsEl = document.createElement("p");
      var scoreEl = document.createElement("p");

      // Set text values and attributes
      indexEl.textContent = `${index + 1}.`;
      initialsEl.textContent = `${score.initials.toUpperCase()} -`;
      scoreEl.textContent = score.score;
      newScore.setAttribute("class", "score");

      // Append to HTML
      scoresWrapper.appendChild(newScore);
      newScore.appendChild(indexEl);
      newScore.appendChild(initialsEl);
      newScore.appendChild(scoreEl);
    });
  }
};

// Update question feedback
var setFeedback = function (isCorrect) {
  if (isCorrect === "true") {
    feedbackEl.textContent = "Correct!";
    changeDisplay("answer-feedback", null);
  } else {
    feedbackEl.textContent = "Wrong!";
    changeDisplay("answer-feedback", null);
  }
};

// Set score
var setScore = function () {
  var totalQuestions = questions.length;
  currentScore = Math.ceil((totalCorrect / totalQuestions) * 100);
  currentScoreEl.textContent = currentScore;
};

// Stop quiz
var stopQuiz = function () {
  clearInterval(timer);
  quizStarted = false;
  setScore();
  changeDisplay("quiz-summary", "quiz");
};

// Reset the quiz
var resetQuiz = function () {
  countdown = 75;
  questionIndex = 0;
  currentScore = 0;
  totalCorrect = 0;
  initialsInput.value = "";
  changeDisplay(null, "answer-feedback");
};

// Start countdown
var startTimer = function () {
  timer = setInterval(function () {
    countdown--;
    updateCountdown();
    if (countdown <= 0 || questionIndex >= questions.length) {
      stopQuiz();
    }
  }, 1000);
};

// Start the quiz
var startQuiz = function () {
  quizStarted = true;
  resetQuiz();
  startTimer();
  changeDisplay("quiz", "start-quiz");
  loadQuestion();
};

// Event listeners
startQuizBtn.addEventListener("click", startQuiz);
goBackBtn.addEventListener("click", function () {
  if (quizStarted) {
    changeDisplay(null, "high-scores");
  } else {
    changeDisplay("start-quiz", "high-scores");
    changeDisplay(null, "quiz-summary");
    changeDisplay(null, "high-scores");
  }
});

// Get user answer input
answerWrapper.addEventListener("click", function (e) {
  var isCorrect = e.target.getAttribute("data-correct-answer");

  if (isCorrect === "true" && questionIndex <= questions.length) {
    questionIndex++;
    totalCorrect++;
    setFeedback(isCorrect);
    loadQuestion();
    // End quiz if last question
    if (questionIndex >= questions.length) {
      stopQuiz();
    }
  } else if (isCorrect === "false") {
    penalizeWrongAnswer();
    setFeedback(isCorrect);
  } else {
    return;
  }
});

// Submit quiz score and initials, then navigate to high scores.
formData.addEventListener("submit", function (e) {
  e.preventDefault();
  var initials = initialsInput.value;

  if (initials.length >= 2 && initials.length <= 5) {
    var newQuiz = {
      initials: initialsInput.value,
      score: currentScore,
    };
    highScores.push(newQuiz);
    changeDisplay("high-scores", null);
    changeDisplay("start-quiz", "quiz-summary");
    loadHighScores();
  } else {
    alert("Initials must be between 2 and 5 characters");
  }
});

// Show and hide high scores section
viewHighScoresBtn.addEventListener("click", function () {
  var isVisible = highScoresSection.getAttribute("data-visible");
  if (isVisible === "true") {
    highScoresSection.setAttribute("data-visible", "false");
    changeDisplay("high-scores", null);
  } else {
    highScoresSection.setAttribute("data-visible", "true");
    changeDisplay(null, "high-scores");
  }
});

clearHighScores.addEventListener("click", clearScores);
