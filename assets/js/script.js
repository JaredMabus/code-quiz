// START: This is the start of your pseudocode.
// INPUT: This is data retrieved from the user through typing or through an input device.
// READ / GET: This is input used when reading data from a data file.
// PRINT, DISPLAY, SHOW: This will show your output to a screen or the relevant output device.
// COMPUTE, CALCULATE, DETERMINE: This is used to calculate the result of an expression.
// SET, INIT: To initialize values
// INCREMENT, BUMP: To increase the value of a variable
// DECREMENT: To reduce the value of a variable

/*
PROGRAM code-quiz

INIT:
    1. question and answer objects
    2. countdown inital time
    3. event listeners
    4. query selectors
    5. user info

Start Quiz: 
    COMPUTE: countdown time and end quiz if time is up.
    GET and DISPLAY: Questions and answers from objects stored in JS file

    INPUT: Create event handlers to get user question input
    COMPUTE: correct or wrong answer
    DISPLAY: "Correct" or "Wrong" answer at the bottom of the quiz
    
    SET: QUIZ score

Summary Page:
    DISPLAY: quiz score
    SET: user score and initials
    SET: new user data to array and sort based on scores

High scores page:
    DISPLAY: highscores
    DISPLAY: Restart and clear scores buttons
*/

// HTML Elements
var countdownEl = document.getElementById("countdown");
var startQuizBtn = document.getElementById("start-quiz-btn");
var questionEl = document.getElementById("current-question");
var answerBtns = document.querySelectorAll(".answer-btn");
var answerWrapper = document.getElementById("answers");
var feedbackEl = document.getElementById("feedback-value");
var questionIndex = 0;
var formData = document.getElementById("user-form");
var initialsInput = document.getElementById("initials-input");
var currentScoreEl = document.getElementById("current-score");
var goBackBtn = document.getElementById("go-back-btn");

var highScores = [];
var currentScore = 0;
var totalCorrect = 0;
var countdown = 0;

var newQuiz = {
  initials: "",
  score: 0,
};

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
  // {
  //   question: "Arrays in JavaScript can be used to store _____.",
  //   answers: [
  //     "numbers and strings",
  //     "other arrays",
  //     "booleans",
  //     "all of the above",
  //   ],
  //   correctAnswer: "parenthesis",
  // },
  // {
  //   question:
  //     "String values must be enclosed within _____ when being assigned to variables.",
  //   answers: ["commas", "curly brakets", "quotes", "parenthesis"],
  //   correctAnswer: "quotes",
  // },
  // {
  //   question:
  //     "A very useful tool used during development and debugging for printing content to the debugger is:",
  //   answers: ["JavaScript", "termical/bash", "for loops", "console.log"],
  //   correctAnswer: "console.log",
  // },
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

// DISPLAY LOGIC
var changeDisplay = function (showId, hideId) {
  if (showId !== null && showId !== undefined) {
    document.getElementById(showId).setAttribute("style", "display: flex;");
  }
  if (hideId !== null && hideId !== undefined) {
    document.getElementById(hideId).setAttribute("style", "display: none;");
  }
  return;
};

// Update/load questions to page
var loadQuestion = function () {
  if (questionIndex >= questions.length) {
    return;
  }
  var currentQuestion = questions[questionIndex];
  var answerBtns = document.querySelectorAll(".answer-btn");
  var answerIndex = 0; // index for answer buttons

  // remove previous answer buttons
  if (answerBtns.length > 0) {
    for (var i = 0; i < answerBtns.length; i++) {
      answerWrapper.removeChild(answerBtns[i]);
    }
  }

  // update current html question h2
  questionEl.textContent = currentQuestion.question;

  // create, add attributes, and append question btns to answer element
  for (var i = 0; i < currentQuestion.answers.length; i++) {
    var currentAnswer = currentQuestion.answers[answerIndex];
    var correctAnswer = currentQuestion.correctAnswer;

    // create element
    var newBtn = document.createElement("button");

    // add attributes
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

// used .sort to set highscores: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
var showHighScores = function () {
  var sortedArray = highScores.sort(function (a, b) {
    if (a.score < b.score) {
      return 1;
    } else if (a.score > b.score) {
      return -1;
    }
  });
  console.log(sortedArray);
};

showHighScores();

var setFeedback = function (isCorrect) {
  if (isCorrect === "true") {
    feedbackEl.textContent = "Correct!";
    changeDisplay("answer-feedback", null);
  } else {
    feedbackEl.textContent = "Wrong!";
    changeDisplay("answer-feedback", null);
  }
};

var setScore = function () {
  var totalQuestions = questions.length;
  currentScore = Math.ceil((totalCorrect / totalQuestions) * 100);
  currentScoreEl.textContent = currentScore;
};

var stopQuiz = function () {
  clearInterval(timer);
  setScore();
  changeDisplay("quiz-summary", "quiz");
};

// Reset the quiz
var resetQuiz = function () {
  countdown = 25;
  questionIndex = 0;
  currentScore = 0;
  totalCorrect = 0;
  initialsInput.value = "";
  changeDisplay(null, "answer-feedback");
};

// start countdown
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
  resetQuiz();
  startTimer();
  changeDisplay("quiz", "start-quiz");
  loadQuestion();
};

// Event listeners
startQuizBtn.addEventListener("click", startQuiz);
goBackBtn.addEventListener("click", function () {
  changeDisplay("start-quiz", "high-scores");
});

// Get user answer input
answerWrapper.addEventListener("click", function (e) {
  var isCorrect = e.target.getAttribute("data-correct-answer");

  if (isCorrect === "true" && questionIndex <= questions.length) {
    questionIndex++;
    totalCorrect++;
    setFeedback(isCorrect);
    loadQuestion();
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
    console.log(highScores);
    changeDisplay("high-scores", "quiz-summary");
    showHighScores();
  } else {
    console.log("Between 2 and 5 characters");
  }
});
