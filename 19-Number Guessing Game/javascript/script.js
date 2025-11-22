let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let gameOver = false;

window.onload = function () {
  // Restore last input value
  const lastInput = localStorage.getItem("lastInput");
  if (lastInput !== null) {
    document.getElementById("userGuess").value = lastInput;
  }
  // Restore last comment and attempts
  const lastComment = localStorage.getItem("lastComment");
  const lastAttempts = localStorage.getItem("lastAttempts");
  if (lastComment !== null) {
    document.getElementById("message").textContent = lastComment;
    if (lastComment.includes("Correct!")) {
      document.getElementById("message").style.color = "green";
      document.getElementById("restartBtn").style.display = "inline-block";
    } else if (
      lastComment.includes("Too high") ||
      lastComment.includes("Too low")
    ) {
      document.getElementById("message").style.color = "red";
      document.getElementById("restartBtn").style.display = "none";
    } else {
      document.getElementById("message").style.color = "";
      document.getElementById("restartBtn").style.display = "none";
    }
  } else {
    document.getElementById("message").textContent = "";
    document.getElementById("restartBtn").style.display = "none";
  }
  if (lastAttempts !== null) {
    document.getElementById("attempts").textContent = lastAttempts;
  } else {
    document.getElementById("attempts").textContent = "";
  }
};

function checkGuess() {
  const userGuess = document.getElementById("userGuess").value;
  const message = document.getElementById("message");
  const attemptsDisplay = document.getElementById("attempts");
  const restartBtn = document.getElementById("restartBtn");

  // Save last input value
  localStorage.setItem("lastInput", userGuess);

  if (gameOver) return;

  attempts++;

  if (userGuess == randomNumber) {
    message.textContent = ` Correct! The number was ${randomNumber}.`;
    message.style.color = "green";
    attemptsDisplay.textContent = `You guessed it in ${attempts} tries.`;
    restartBtn.style.display = "inline-block";
    gameOver = true;
    localStorage.setItem("lastComment", message.textContent);
    localStorage.setItem("lastAttempts", attemptsDisplay.textContent);
  } else if (userGuess > randomNumber) {
    message.textContent = " Too high! Try again.";
    message.style.color = "red";
    attemptsDisplay.textContent = `You guessed ${attempts} time(s).`;
    localStorage.setItem("lastComment", message.textContent);
    localStorage.setItem("lastAttempts", attemptsDisplay.textContent);
  } else if (userGuess < randomNumber) {
    message.textContent = " Too low! Try again.";
    message.style.color = "red";
    attemptsDisplay.textContent = `You guessed ${attempts} time(s).`;
    localStorage.setItem("lastComment", message.textContent);
    localStorage.setItem("lastAttempts", attemptsDisplay.textContent);
  }
}

function restartGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  gameOver = false;
  localStorage.removeItem("lastInput");
  localStorage.removeItem("lastComment");
  localStorage.removeItem("lastAttempts");
  document.getElementById("userGuess").value = "";
  document.getElementById("message").textContent = "";
  document.getElementById("attempts").textContent = "";
  document.getElementById("restartBtn").style.display = "none";
}
