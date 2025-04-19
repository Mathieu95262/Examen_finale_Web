
function afficherRecord() {
    const record = JSON.parse(localStorage.getItem("record")) || [];
    const container = document.getElementById("record-container");
  
    if (record.length === 0) {
      container.innerHTML += "<p>Aucun record enregistré.</p>";
      return;
    }
  
    record.forEach((record, index) => {
      const ligne = document.createElement("div");
      ligne.classList.add("record-item");
      ligne.innerHTML = `
        <p><strong>Partie ${index + 1}</strong></p>
        <p>Mots corrects : ${record.motsCorrects}</p>
        <p>Mots incorrects : ${record.motsIncorrects}</p>
        <p>WPM : ${record.wpm}</p>
        <p>Date : ${record.date}</p>
        <hr>
      `;
      container.appendChild(ligne);
    });
  }
  
  window.onload() = afficherRecord;
  