/**
 * Point culture (en Français car je suis un peu obligé):
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces.
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 */

// Données de mots selon le niveau
const words = {
  easy: ["apple", "banana", "grape", "orange", "cherry"],
  medium: ["keyboard", "monitor", "printer", "charger", "battery"],
  hard: [
    "synchronize",
    "complicated",
    "development",
    "extravagant",
    "misconception",
  ],
};

let currentDifficulty = "easy";
let wordCount = 0;
let correctChars = 0;
let totalChars = 0;

// Variables pour le timer
let time = 20;
let timeInterval;
let isPlaying = false;
let timerStarted = false;
const timeDisplay = document.getElementById("time");
const timeLeftBar = document.getElementById("time-left");

const container = document.getElementById("word-container");
const input = document.getElementById("input-container");
const loading = document.getElementById("loading");
const wordCountDisplay = document.getElementById("word-count");
const accuracyDisplay = document.getElementById("accuracy");
const modeSelect = document.getElementById("mode");

const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const section_wordDisplay = document.querySelector(".section_word-display");

function getRandomWord(mode) {
  const wordList = words[mode];
  return wordList[Math.floor(Math.random() * wordList.length)];
}

function displayWord(word) {
  container.innerHTML = "";
  container.classList.remove("word-transition");
  void container.offsetWidth; // Trigger reflow
  container.classList.add("word-transition");

  for (let letter of word) {
    const span = document.createElement("span");
    span.textContent = letter;
    span.classList.add("letter");
    container.appendChild(span);
  }
}

// Initialiser le test de frappe
const startTest = (wordCount = 50) => {
  wordsToType.length = 0; // effacer le mot précédent
  wordDisplay.innerHTML = ""; // Affichage clair
  currentWordIndex = 0;
  startTime = null;
  previousEndTime = null;
  trueWords = 0;
  falseWords = 0;

  // Réinitialiser le timer
  time = 20;
  timeDisplay.textContent = time;
  timeLeftBar.style.width = '100%';
  timerStarted = false;
  isPlaying = true;
  inputField.readOnly = false;

  inputField.value = "";
  results.textContent = "";
  inputField.focus();
};

function showNextWord() {
  displayWord(getRandomWord(currentDifficulty));
  input.value = "";
  input.focus();
  wordCount++;
  wordCountDisplay.textContent = wordCount;
}

function nextWordWithLoading() {
  container.style.opacity = "0";
  input.style.display = "none";
  loading.style.display = "block";

  setTimeout(() => {
    showNextWord();
    container.style.opacity = "1";
    input.style.display = "block";
    loading.style.display = "none";
  }, 500);
}

function updateAccuracy() {
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
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
  wordCount = 0;
  correctChars = 0;
  totalChars = 0;
  wordCountDisplay.textContent = "0";
  accuracyDisplay.textContent = "100%";
  accuracyDisplay.style.color = "#00a8ff";
  showNextWord();
}

// Démarrer le minuteur lorsque l'utilisateur commence à taper
const startTimer = () => {
  if (!timerStarted) {
    timerStarted = true;
    clearInterval(timeInterval);
    timeInterval = setInterval(updateTimer, 1000);
  }
};

function updateTimer() {
  time--;
  timeDisplay.textContent = time;
  timeLeftBar.style.width = (time / 20) * 100 + '%';

  if (time <= 0) {
    endGame();
  }
}

function endGame() {
  clearInterval(timeInterval);
  isPlaying = false;
  inputField.readOnly = true;

  document.getElementById("score-final").style.height = "40rem";
  document.getElementById("score-final").style.width = "40rem";
  document.getElementById("score-final").style.padding = "30px";
  document.getElementById("score-de-jeux").textContent = `Score: ${trueWords} mots corrects`;
}

input.addEventListener("input", () => {
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
      spans[i].classList.add("wrong");
    }
  }

  updateAccuracy();

  // Mot complet (vérifie si la longueur correspond et si le dernier caractère est correct)
  if (typed.length === word.length) {
    nextWordWithLoading();
  }
});

modeSelect.addEventListener("change", () => {
  currentDifficulty = modeSelect.value;
  changeStylBorder(currentDifficulty);
  resetTest();
});

// Affichage initial
resetTest();

// Clavier visuel
const keys = "AZERTYUIOPQSDFGHJKLMWXCVBN".split(""); // Lettres du clavier
const keyboardDiv = document.getElementById("keyboard");
const textInput = document.getElementById("input-field"); // Changé pour correspondre à votre champ d'entrée
let ignoreNextKeydown = false; // Nouveau flag pour éviter les doubles entrées

document.addEventListener("click", (event) => {
  if (event.target !== textInput) {
    inputField.focus();
  }
});

// pour activer une touche et ajouter la lettre dans l'input
function activateKey(keyPressed, fromClick = false) {
  let keyDiv = document.getElementById(`key-${keyPressed.toLowerCase()}`);
  if (keyDiv) {
    keyDiv.classList.add("active");
    if (fromClick) {
      ignoreNextKeydown = true; // On ignore le prochain keydown
      const inputEvent = new Event("input", { bubbles: true });
      textInput.value += keyPressed;
      textInput.dispatchEvent(inputEvent);
    }
    setTimeout(() => keyDiv.classList.remove("active"), 300);
  }
}

// Générer les touches du clavier visuel
function changeStylBorder(difficulty) {
  keyboardDiv.innerHTML = "";

  keys.forEach((letter) => {
    let keyDiv = document.createElement("div");
    keyDiv.classList = '';
    keyDiv.classList.add(`key_${difficulty}`); // Utilise la nouvelle difficulté
    keyDiv.textContent = letter;
    keyDiv.id = `key-${letter.toLowerCase()}`;
    keyboardDiv.appendChild(keyDiv);

    keyDiv.addEventListener("click", (e) => {
      e.preventDefault();
      activateKey(letter.toLowerCase(), true);
    });
  });
}

// Écouteur d'événements pour détecter les touches du clavier physique
document.addEventListener("keydown", (event) => {
  if (ignoreNextKeydown) {
    ignoreNextKeydown = false;
    return;
  }

  let keyPressed = event.key.toLowerCase();
  if (keys.includes(event.key.toUpperCase())) {
    activateKey(keyPressed);
  }

  // Gestion spéciale pour la touche Backspace
  if (event.key === "Backspace") {
    event.preventDefault();
    textInput.value = textInput.value.slice(0, -1);
    const inputEvent = new Event("input", { bubbles: true });
    textInput.dispatchEvent(inputEvent);
  }
});
