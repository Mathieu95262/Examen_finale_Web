const title = document.querySelector("h1");
const words = ["BIENVENUE", "SUR", "RIBLY_TAP_EVO Z"];
let currentWordIndex = 0;
let isTyping = true;




function typeWord(word, index) {
  if (index < word.length) {
    setTimeout(() => {
      title.innerHTML += word[index];
      typeWord(word, index + 1);
    }, 100*(word[index].length));
  } else {
    isTyping = false;
    setTimeout(() => {
      eraseWord(word, word.length - 1);
    }, 1000);
  }
}

function eraseWord(word, index) {
  if (index >= 0) {
    setTimeout(() => {
      title.innerHTML = word.substring(0, index);
      eraseWord(word, index - 1);
    }, 100*(word[index].length));
  } else {
    isTyping = true;
    currentWordIndex++;
    if (currentWordIndex < words.length) {
      setTimeout(() => {
        typeWord(words[currentWordIndex], 0);
      }, 1000);
    } else {
      currentWordIndex = 0;
      setTimeout(() => {
        typeWord(words[currentWordIndex], 0);
      }, 1000);
    }
  }
}

typeWord(words[currentWordIndex], 0);
