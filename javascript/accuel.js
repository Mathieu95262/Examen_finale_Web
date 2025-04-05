/**
 * Point culture (en Français car je suis un peu obligé):
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces.
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 *
 * Sur ce... Amusez-vous bien !
 */
let startTime = null,
  previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const section_wordDisplay = document.querySelector(".document.getElementById");

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

//,Générer un mot aléatoire à partir du mode sélectionné
const getRandomWord = (mode) => {
  const wordList = words[mode];
  return wordList[Math.floor(Math.random() * wordList.length)];
};

//Initialiser le test de frappe
const startTest = (wordCount = 50) => {
  wordsToType.length = 0; //effacer le mot précédent
  wordDisplay.innerHTML = ""; //Affichage clair
  currentWordIndex = 0;
  startTime = null;
  previousEndTime = null;

  for (let i = 0; i < wordCount; i++) {
    wordsToType.push(getRandomWord(modeSelect.value));
  }

  wordsToType.forEach((word, index) => {
    const span = document.createElement("span");
    span.innerHTML = word + "<br>";
    span.style.transform = "translateY(0rem)";

    if (index === 0) {
      span.style.color = "red"; // Surligner le premier mot
    }
    wordDisplay.appendChild(span);
  });

  inputField.value = "";
  results.textContent = "";
};

// Démarrer le minuteur lorsque l'utilisateur commence à taper
const startTimer = () => {
  if (!startTime) startTime = Date.now();
};

// Calculer et renvoyer les mots par minute et la précision
const getCurrentStats = () => {
  const elapsedTime = (Date.now() - previousEndTime) / 1000;
  const wpm = wordsToType[currentWordIndex].length / 5 / (elapsedTime / 60); // WPM

  let accuracy = 0;

  // Vérification avant de calculer accuracy
  if (inputField.value.length > 0) {
    accuracy =
      (Math.min(wordsToType[currentWordIndex].length, inputField.value.length) /
        inputField.value.length) *
      100;
  }

  return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};
// Passer au mot suivant et mettre à jour les statistiques uniquement en appuyant sur la barre d'espace
function updateWord(event) {
  if (event.key === " ") {
    // Vérifiez si la barre d'espace est enfoncée
    if (inputField.value.trim() === wordsToType[currentWordIndex]) {
      if (!previousEndTime) previousEndTime = startTime;

      const { wpm, accuracy } = getCurrentStats();
      results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;

      currentWordIndex++;
      previousEndTime = Date.now();
      highlightNextWord();

      inputField.value = ""; // Effacer le champ de saisie après un espace
      event.preventDefault(); // Empêcher l'ajout d'espaces supplémentaires
    }
  }
}

// Highlight the current word in red

const highlightNextWord = () => {
  const wordElements = wordDisplay.children;

  if (currentWordIndex < wordElements.length) {

    if (currentWordIndex > 0) {
      const previous = wordElements[currentWordIndex - 1];
      previous.classList.remove("highlighted");
      previous.classList.add("faded");
    }


    const current = wordElements[currentWordIndex];
    current.classList.add("highlighted");

    wordDisplay.style.transform = `translateY(-${currentWordIndex * 3}rem)`;
  }
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
  startTimer();
  updateWord(event);
});
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();
