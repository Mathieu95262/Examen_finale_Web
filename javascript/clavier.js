const keys = "AZERTYUIOPQSDFGHJKLMWXCVBN".split(""); // Lettres du clavier
const keyboardDiv = document.getElementById("keyboard");
const textInput = document.getElementById("input-field"); // Changé pour correspondre à votre champ d'entrée
let ignoreNextKeydown = false; // Nouveau flag pour éviter les doubles entrées

document.addEventListener("click", (event) => {
  if (event.target !== textInput) {
    inputField.focus();
  }
});

//pour activer une touche et ajouter la lettre dans l'input
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
keys.forEach((letter) => {
  let keyDiv = document.createElement("div");
  keyDiv.classList.add(`key_${currentDifficulty}`);
  keyDiv.textContent = letter;
  keyDiv.id = `key-${letter.toLowerCase()}`;
  keyboardDiv.appendChild(keyDiv);

  // Ajouter un événement de clic pour activer la touche
  keyDiv.addEventListener("click", (e) => {
    e.preventDefault();
    activateKey(letter.toLowerCase(), true);
  });
});

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