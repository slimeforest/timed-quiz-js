var secondsLeft = 120;
var timer = document.getElementById("timer");
var scores = document.getElementById("scores");
var buttons = document.getElementById("buttons")
var viewScoresButton = document.getElementById("view-scores")
var startButton = document.getElementById("start-button");
var questionDiv = document.getElementById("questions");
var results = document.getElementById("results");
var options = document.getElementById("options");
var emptyArray = [];
var storedArray = JSON.parse(window.localStorage.getItem("highScores"));
var questionCount = 0;
var score = 0

startButton.addEventListener("click", setTime);

function setTime() {
  displayQuestions();
  let timerInterval = setInterval(function() {
    secondsLeft--;
    timer.textContent = "";
    timer.textContent = "Time left: " + secondsLeft;
    if (secondsLeft <= 0 || questionCount === questions.length) {
      clearInterval(timerInterval);
      captureUserScore();
    } 
  }, 1000);
}

function displayQuestions() {
  removeEls(startButton);
  if (questionCount < questions.length) {
    questionDiv.innerHTML = questions[questionCount].title;
    options.textContent = "";

    for (let i = 0; i < questions[questionCount].multipleChoice.length; i++) {
      let el = document.createElement("button");
      el.innerText = questions[questionCount].multipleChoice[i];
      el.setAttribute("data-id", i);
      el.addEventListener("click", function (event) {
        event.stopPropagation();
        if (el.innerText === questions[questionCount].answer) {
          score += secondsLeft;
        } else {
          score -= 10;
          secondsLeft = secondsLeft - 25;
        }
        questionDiv.innerHTML = "";
        if (questionCount === questions.length) {
          return;
        } else {
          questionCount++;
          displayQuestions();
        }
      });
      options.append(el);
    }
  }
}


function captureUserScore() {
  timer.remove();
  options.textContent = "";
  let initialsInput = document.createElement("input");
  let postScoreBtn = document.createElement("input");

  results.innerHTML = "You scored " + score + " points! Enter initials: ";
  initialsInput.setAttribute("type", "text");
  postScoreBtn.setAttribute("type", "button");
  postScoreBtn.setAttribute("value", "Post My Score!");
  postScoreBtn.addEventListener("click", function (event) {
    event.preventDefault();
    let scoresArray = defineScoresArray(storedArray, emptyArray);
    let initials = initialsInput.value;
    let userAndScore = {
      initials: initials,
      score: score,
    };
    scoresArray.push(userAndScore);
    saveScores(scoresArray);
    displayAllScores();
    clearScoresBtn();
    goBackBtn();
    viewScoresButton.remove();
  });
  results.append(initialsInput);
  results.append(postScoreBtn);
}

const saveScores = (array) => {
  window.localStorage.setItem("highScores", JSON.stringify(array));
}

const defineScoresArray = (arr1, arr2) => {
  if(arr1 !== null) {
    return arr1
  } else {
    return arr2
  }
}

const removeEls = (...els) => {
  for (let el of els) el.remove();
}

function displayAllScores() {
  removeEls(timer, startButton, results);
  let scoresArray = defineScoresArray(storedArray, emptyArray);

  scoresArray.forEach(obj => {
    let initials = obj.initials;
    let storedScore = obj.score;
    let resultsP = document.createElement("p");
    resultsP.innerText = `${initials}: ${storedScore}`;
    scores.append(resultsP);
  });
}

function viewScores() {
  viewScoresButton.addEventListener("click", function(event) {
    event.preventDefault();
    removeEls(timer, startButton);
    displayAllScores();
    removeEls(viewScoresButton);
    clearScoresBtn();
    goBackBtn();
  });
}

function clearScoresBtn() {    
  let clearBtn = document.createElement("input");
  clearBtn.setAttribute("type", "button");
  clearBtn.setAttribute("value", "Clear Scores");
  clearBtn.setAttribute("id", "clearButton");
  clearBtn.addEventListener("click", function(event){
    event.preventDefault();
    removeEls(scores);
    window.localStorage.removeItem("highScores");
  })
  scores.append(clearBtn)
}

function goBackBtn() {
  let backBtn = document.createElement("input");
  backBtn.setAttribute("type", "button");
  backBtn.setAttribute("value", "Go Back");
  backBtn.setAttribute("id", "goBackButton")
  backBtn.addEventListener("click", function(event){
    event.preventDefault();
    window.location.reload();
  })
  buttons.append(backBtn)
}

viewScores();