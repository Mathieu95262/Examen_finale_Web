const connectButton = document.getElementById("login");
const inputs = document.querySelectorAll("input");

function validCompte(inputElements) {
  let isValid = true;

  inputElements.forEach((input) => {
    if (!input.value || input.value.trim() === "") {
      input.style.border = "2px solid red";
      isValid = false;
    } else {
      input.style.border = "2px solid green";
    }
  });

  return isValid;
}

connectButton.addEventListener("click", (e) => {
  e.preventDefault();

  if (validCompte(inputs)) {
    window.location.href = "accuel.html";
  } 
});
