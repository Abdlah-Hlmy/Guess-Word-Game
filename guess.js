// Setting Game Name
let gameName = "Guess The Word"
document.title = gameName;
document.querySelector("h1").innerHTML = gameName
document.querySelector("footer").innerHTML = `${gameName} Game Created By Elzero Web School`

// Setting Game Options
let numbersOfTries = 6;
let numbersOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase()
let messageArea = document.querySelector(".message")

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints
const hintBtn = document.querySelector(".hint")
hintBtn.addEventListener("click", handleHints)

function generateInput() {
  const inputsContainer = document.querySelector(".inputs")

  // Create Main Try Loop
  for (let i = 1; i <= numbersOfTries; i++) {
    const tryDiv = document.createElement("div")
    tryDiv.classList.add(`try-${i}`)
    tryDiv.innerHTML = `<span>Try ${i} </span>`

    if (i !== 1) tryDiv.classList.add("disabled-inputs")

    for (let j = 1; j <= numbersOfLetters; j++) {
      const input = document.createElement("input")
      input.type = "text"
      input.id = `guess-${i}-letter-${j}`
      input.setAttribute("maxlength", "1")
      tryDiv.append(input)
    }
    inputsContainer.appendChild(tryDiv);
  }

  // Focus On First Input In First Try Element
  inputsContainer.children[0].children[1].focus()

  // Disable All Inputs Except First One
  const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
  inputsInDisabledDiv.forEach((input) => (input.disabled = true));

  const inputs = document.querySelectorAll("input")
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = input.value.toUpperCase()
      // console.log(index)
      const nextInput = inputs[index + 1]
      if (nextInput) nextInput.focus()
    });


    input.addEventListener("keydown", function (event) {
      // console.log(event)
      let currentIndex = Array.from(inputs).indexOf(event.target);

      if (event.key === "ArrowRight") {
        let nextInput = currentIndex + 1
        if (nextInput < inputs.length) inputs[nextInput].focus()
      } else if (event.key === "ArrowLeft") {
        let prevInput = currentIndex - 1
        if (prevInput >= 0) inputs[prevInput].focus()
      }
    });
  })
}

const guessBtn = document.querySelector(".check")
guessBtn.addEventListener("click", handleGuesses)

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numbersOfLetters; i++) {
    const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game Logic
    if (letter === actualLetter) {
      // Letter Is Correct And In Place
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // Letter Is Correct And Not In Place
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  if (successGuess) {
    messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`
    if (numberOfHints === 2) {
      messageArea.innerHTML = `<p>Congratulations You Didn't Use Hints<\p> The Word Is <span>${wordToGuess}</span>`
    }
    // Add Disabled Class To All Try Divs
    let allDivs = document.querySelectorAll(".inputs > div")
    allDivs.forEach((tryDiv) => (tryDiv.classList.add("disabled-inputs")))
    const allInputs = document.querySelectorAll("input");
    allInputs.forEach((input) => (input.disabled = true));
    // Disable Guess Button
    guessBtn.disabled = true
    hintBtn.disabled = true
  }
  else {
    document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs")
    const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`)
    currentTryInputs.forEach((input) => (input.disabled = true))

    currentTry++

    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`)
    nextTryInputs.forEach((input) => (input.disabled = false))

    let el = document.querySelector(`.try-${currentTry}`)
    if (el) {
      document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs")
      el.children[1].focus()
    }
    else {
      guessBtn.disabled = true
      hintBtn.disabled = true
      messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`
    }
  }
}

function handleHints() {
  if (numberOfHints > 0) {
    numberOfHints--
    document.querySelector(".hint span").innerHTML = numberOfHints
  }
  if (numberOfHints === 0) hintBtn.disabled = true

  const enabledInputs = document.querySelectorAll("input:not([disabled])")
  const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => (input.value === ""))
  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length)
    const randomInput = emptyEnabledInputs[randomIndex]
    const inputToFill = Array.from(enabledInputs).indexOf(randomInput)

    if (inputToFill !== -1) {
      randomInput.value = wordToGuess[inputToFill].toUpperCase()
    }
  }
}

function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])")
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex]
      const prevInput = inputs[currentIndex - 1]
      currentInput.value = ""
      prevInput.value = ""
      prevInput.focus()
    }
  }
}

document.addEventListener("keydown", handleBackspace)

let reBtn = document.querySelector(".reload")
reBtn.addEventListener("click", () => {
  location.reload()
})

window.onload = function () {
  generateInput()
}