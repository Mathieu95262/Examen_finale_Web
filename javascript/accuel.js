/**
 * Point culture (en Français car je suis un peu obligé):
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces.
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 */

// Données de mots selon le niveau
const words = {
  easy: ["apple", "banana", "grape", "orange", "cherry",
    "lemon", "peach", "pear", "plum", "melon",
    "bread", "chair", "table", "water", "cloud"],
  medium: ["keyboard", "monitor", "printer", "charger", "battery",
    "window", "folder", "object", "browser", "cursor",
    "laptop", "button", "screen", "scroll", "tablet"],
  hard: [
    "synchronize","complicated","development","extravagant","misconception","hypothesis", "architecture", "multithreaded", "transcendental", "cryptography",
    "implementation", "configuration", "parallelism", "decentralized", "approximation"
  ],
};

const container = document.getElementById("word-container");
const input = document.getElementById("input-container");
const loading = document.getElementById("loading");
const wordCountDisplay = document.getElementById("word-count");
const accuracyDisplay = document.getElementById("accuracy");
const modeSelect = document.getElementById("mode");
const timeDisplay = document.getElementById("time-display");
const timeBar = document.getElementById("time-bar");

// valeur initiale
//pour le timer
let timeLeft = 15;
let timerInterval;
let isPlaying = false;

//pour les mode de jeux
let currentDifficulty = "easy";
let wordCount = 0;
let correctChars = 0;
let totalChars = 0;


// Fonction pour démarrer le timer
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 15;
  updateTimerDisplay();
  isPlaying = true;

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}


function updateTimerDisplay() {
  timeDisplay.textContent = timeLeft;
  timeBar.style.width = `${(timeLeft / 15) * 100}%`;
  
  // Changement de couleur selon le temps restant
  if (timeLeft <= 10) {
    timeDisplay.style.color = "#ff0000";
    timeBar.style.backgroundColor = "#ff0000";
  } else if (timeLeft <= 20) {
    timeDisplay.style.color = "#ff9900";
    timeBar.style.backgroundColor = "#ff9900";
  } else {
    timeDisplay.style.color = "#00ff44";
    timeBar.style.backgroundColor = "#00ff44";
  }
}

function endGame() {
  clearInterval(timerInterval);
  isPlaying = false;
  input.readOnly = true;
  
  // Afficher le score final
  alert(`Temps écoulé !\nMots tapés: ${wordCount}\nPrécision: ${accuracyDisplay.textContent}`);
}

function getRandomWord(mode) {
  const wordList = words[mode];
  return wordList[Math.floor(Math.random() * wordList.length)];
}

function displayWord(word) {
  container.innerHTML = "";
  container.classList.remove("word-transition");
  void container.offsetWidth; 
  container.classList.add("word-transition");

  for (let letter of word) {
    const span = document.createElement("span");
    span.textContent = letter;
    span.classList.add("letter");
    container.appendChild(span);
  }
}

function showNextWord() {
  displayWord(getRandomWord(currentDifficulty));
  input.value = "";
  input.focus();
  wordCount++;
  wordCountDisplay.textContent = wordCount;
  
  // Ajout de temps bonus pour chaque nouveau mot
  if (isPlaying) {
    timeLeft += currentDifficulty === "easy" ? 2 : 
    currentDifficulty === "medium" ? 3 : 5;
    if (timeLeft > 15) timeLeft = 15;
    updateTimerDisplay();
  }
}

function nextWordWithLoading() {
  container.style.opacity = "0";
  input.style.display = "none";
  loading.style.opacity = "1";

  setTimeout(() => {
    showNextWord();
    container.style.opacity = "1";
    input.style.display = "block";
    loading.style.opacity = "0";
    input.focus();
  }, 600);
}
function updateAccuracy() {
  const accuracy =
    totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
  accuracyDisplay.textContent = `${accuracy}%`;

  if (accuracy >= 90) {
    accuracyDisplay.style.color = "#00ff44";
  } else if (accuracy >= 70) {
    accuracyDisplay.style.color = "#ffcc00";
  } else {
    accuracyDisplay.style.color = "#ff3333";
  }
}


function resetTest() {
  clearInterval(timerInterval); 
  wordCount = 0;
  correctChars = 0;
  totalChars = 0;
  wordCountDisplay.textContent = "0";
  accuracyDisplay.textContent = "100%";
  accuracyDisplay.style.color = "#00a8ff";
  isPlaying = false;
  showNextWord();
  setTimeout(() => input.focus(), 100);
}


input.addEventListener("input", () => {
  if (!isPlaying) {
    isPlaying = true; 
    startTimer();

  }
  
  const word = container.textContent;
  const typed = input.value;
  const spans = container.querySelectorAll(".letter");

  // Réinitialiser les classes
  spans.forEach((span) => (span.className = "letter"));

  // Vérifier chaque caractère
  for (let i = 0; i < typed.length; i++) {
    if (i >= word.length) break;

    totalChars++;
    if (typed[i] === word[i]) {
      spans[i].classList.add("correct");
      correctChars++;
    } else {
      spans[i].classList.add("incorrect");
    }
  }

  updateAccuracy();

  // Passer au mot suivant quand on a fini de taper le précédent
  if (typed.length === word.length) {
    nextWordWithLoading();
  }
});

modeSelect.addEventListener("change", () => {
  currentDifficulty = modeSelect.value;
  changeStylBorder(currentDifficulty);
  resetTest();
});


window.addEventListener("DOMContentLoaded", () => {
  clearInterval(timerInterval);
  isPlaying = false;
  changeStylBorder(currentDifficulty);
  resetTest();
  input.focus();               
});

// Clavier visuel
const keys = "AZERTYUIOPQSDFGHJKLMWXCVBN".split("");
const keyboardDiv = document.getElementById("keyboard");
const textInput = document.getElementById("input-field");
let ignoreNextKeydown = false;


function activateKey(keyPressed, fromClick = false) {
  let keyDiv = document.getElementById(`key-${keyPressed.toLowerCase()}`);
  if (keyDiv) {
    keyDiv.classList.add("active");
    if (fromClick) {
      ignoreNextKeydown = true;
      const inputEvent = new Event("input", { bubbles: true });
      textInput.value += keyPressed;
      textInput.dispatchEvent(inputEvent);
    }
    setTimeout(() => keyDiv.classList.remove("active"), 300);
  }
}

function changeStylBorder(difficulty) {
  keyboardDiv.innerHTML = "";

  keys.forEach((letter) => {
    let keyDiv = document.createElement("div");
    keyDiv.classList= '';
    keyDiv.classList.add(`key_${difficulty}`);
    keyDiv.textContent = letter;
    keyDiv.id = `key-${letter.toLowerCase()}`;
    keyboardDiv.appendChild(keyDiv);

    keyDiv.addEventListener("click", (e) => {
      e.preventDefault();
      activateKey(letter.toLowerCase(), true);
    });
  });
}

document.addEventListener("keydown", (event) => {
  if (ignoreNextKeydown) {
    ignoreNextKeydown = false;
    return;
  }

  let keyPressed = event.key.toLowerCase();
  if (keys.includes(event.key.toUpperCase())) {
    activateKey(keyPressed);
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    textInput.value = textInput.value.slice(0, -1);
    const inputEvent = new Event("input", { bubbles: true });
    textInput.dispatchEvent(inputEvent);
  }
})