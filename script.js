// Select elements
const lengthInput = document.querySelector('.length-input');
const maxLength = lengthInput.getAttribute('max');
const minLength = 6;
const passwordLengthEl = document.querySelector('.password-length');
let passwordLength = minLength;
// Get all css properties and values of the document and then get the value of that specific property "main-color"
const mainColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color');

// Make the range interactive
lengthInput.addEventListener('input', () => {
  const inputValue = lengthInput.value;
  if (inputValue >= minLength) {
    let colorStop = `${(inputValue / maxLength) * 100}%`;
    lengthInput.style.background = `linear-gradient(90deg, ${mainColor} ${colorStop}, rgba(58,57,64,1) ${colorStop})`;
    passwordLength = lengthInput.value;
    passwordLengthEl.textContent = passwordLength;
  }
})