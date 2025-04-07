const keys = "AZERTYUIOPQSDFGHJKLMWXCVBN".split(""); // Lettres du clavier
const keyboardDiv = document.getElementById("keyboard");
const textInput = document.getElementById("input-field");

document.addEventListener("click", (event) => {
  if (event.target !== textInput) {
    inputField.focus();
  }
});
//pour activer une touche et ajouter la lettre dans l'input
function activateKey(keyPressed) {
  let keyDiv = document.getElementById(`key-${keyPressed}`);
  if (keyDiv) {
    keyDiv.classList.add("active");
    textInput.value += keyPressed; // Ajoute la lettre dans l'input

    // Enlever l'effet click après 300ms
    setTimeout(() => keyDiv.classList.remove("active"), 300);
  }
}
// Générer les touches du clavier visuel
keys.forEach((letter) => {
  let keyDiv = document.createElement("div");
  keyDiv.classList.add("key");
  keyDiv.textContent = letter;
  keyDiv.id = `key-${letter.toLowerCase()}`;
  keyboardDiv.appendChild(keyDiv);

  // Ajouter un événement de clic pour activer la touche
  keyDiv.addEventListener("click", () => activateKey(letter.toLowerCase()));
});

//ajouter une touche entre
let enterKey = document.createElement("div");
keyboardDiv.appendChild(enterKey);
enterKey.classList.add("key", "key-enter");
enterKey.textContent = "OK";
enterKey.style.gridColumn = "span 4";
enterKey.style.backgroundColor = "green";

// Écouteur d'événements pour détecter les touches du clavier physique
document.addEventListener("keydown", (event) => {
  let keyPressed = event.key.toLowerCase();
  if (keys.includes(event.key.toUpperCase())) {
    activateKey(keyPressed);
  }
});
