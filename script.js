// Select elements
const lengthInput = document.querySelector('.length-input');
const maxLength = lengthInput.getAttribute('max');
const minLength = 6;
const passwordLengthEl = document.querySelector('.password-length');
let passwordLength = localStorage.getItem('password-length') || minLength;
// Get all css properties and values of the document and then get the value of that specific property "main-color"
const mainColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
const lengthErrMsg = document.querySelector('.length-err-msg');
const generateBtn = document.querySelector('.generate-btn');
const passwordText = document.querySelector('.password-text');
const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
const settingsErrMsg = document.querySelector('.settings-err-msg');
const strengthMsg = document.querySelector('.strength .message');
const strengthBars = document.querySelectorAll('.bars .bar');
let barsLength = 0;
const copyPassword = document.querySelector('.copy-btn');
const copied = document.querySelector('.copied');


// Make the range interactive
lengthInput.addEventListener('input', () => {
  const inputValue = lengthInput.value;
  if (inputValue >= minLength) {
    let colorStop = `${(inputValue / maxLength) * 100}%`;
    const color = `linear-gradient(90deg, ${mainColor} ${colorStop}, rgba(58,57,64,1) ${colorStop})`;
    lengthInput.style.background = color;
    localStorage.setItem('color', color);
    passwordLength = lengthInput.value;
    passwordLengthEl.textContent = passwordLength;
    lengthErrMsg.classList.add('hidden');
  }
  // Display error message If password length less than 6 characters 
  else {
    lengthInput.value = minLength;
    lengthErrMsg.classList.remove('hidden');
  }
})

// Generate random password
const SETTINGS = {
  lowercase: [...'abcdefghijklmnopqrstuvwxyz'],
  uppercase: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
  numbers: [...'0123456789'],
  symbols: [...'~!@#$%^&*()+_/'],
}

let selectedSettings = [];
let randomPassword = '';

generateBtn.addEventListener('click', () => {
  selectedSettings = [];
  randomPassword = '';
  for (const checkBox of checkBoxes) {
    if (checkBox.checked) selectedSettings.push(checkBox.className);
  }
  
  if (selectedSettings.length >= 1) {
    for (let i = 0; i < passwordLength; i++) {
      let randomSetting = selectedSettings[Math.floor(Math.random() * selectedSettings.length)];
      randomPassword += SETTINGS[randomSetting][Math.floor(Math.random() * SETTINGS[randomSetting].length)];
    }
    passwordText.value = randomPassword;
    settingsErrMsg.classList.add('hidden');
    copyPassword.innerHTML = '<ion-icon class="copy-btn" name="copy-outline"></ion-icon>';
  } else {
    settingsErrMsg.classList.remove('hidden');
  }
  passwordStrength()
  saveSelections()
  saveLength()
})

// Strength meter
function passwordStrength() {
  const selectedSettingsLength = selectedSettings.length;
  const settingsScore = selectedSettingsLength * 20;
  const passwordLengthScore = passwordLength < 15 ? 10 : 20;
  const totalScore = settingsScore + passwordLengthScore;

  if (totalScore >= 80) {
    strengthMsg.textContent = 'STRONG';
    barsLength = 4;
    changeBarsColor(mainColor)
  }
  else if (totalScore > 50) {
    strengthMsg.textContent = 'MEDIUM';
    barsLength = 3;
    changeBarsColor('#f8cb63')
  } 
  else {
    strengthMsg.textContent = 'WEAK';
    barsLength = 1;
    changeBarsColor('#fb7a56')
  }
}

function changeBarsColor(color) {
    for (const bar of strengthBars) {
      bar.style.cssText = `
      background-color: 'transparent';
      border-color: '#fff';
    `
  }

  for (let i = 0; i < barsLength; i++) {
    strengthBars[i].style.cssText = `
    background-color: ${color};
    border-color: ${color};
   `
  }
}

// Copy the password
copyPassword.addEventListener('click', () => {
  if (passwordText.value) {
    passwordText.select()
    navigator.clipboard.writeText(passwordText.value);
    // Show "copied" text and hide copy button
    copied.classList.remove('text-hide');
    copyPassword.classList.add('hidden');
    // Hide "copied" text after 3 seconds and show copy button
    setTimeout(() => {
      copied.classList.add('text-hide');
      copyPassword.classList.remove('hidden');
    }, 3000);
  }
})

function saveSelections() {
  const indexesOfSelectedBoxes = [];
  checkBoxes.forEach((checkBox, index) => {
    if (checkBox.checked) indexesOfSelectedBoxes.push(index);
  })
  localStorage.setItem('indexes-of-selected-boxes', indexesOfSelectedBoxes);
}

const savedIndexes = localStorage.getItem('indexes-of-selected-boxes');

function selectUserSelections() {
  const selectedBoxesArr = savedIndexes.split(',');

  checkBoxes.forEach(checkBox => checkBox.checked = false);

  selectedBoxesArr.forEach(checkBoxIndex => {
    const checkBoxEl = checkBoxes[checkBoxIndex];
    checkBoxEl.checked = true;
  })
}

if (savedIndexes) selectUserSelections();

function saveLength() {
  localStorage.setItem('password-length', lengthInput.value);
}

function displayPassLength() {
  const savedPassLength = localStorage.getItem('password-length');
  const savedColor = localStorage.getItem('color');

  if (savedPassLength) {
    lengthInput.value = savedPassLength;
    passwordLengthEl.innerText = savedPassLength;
    lengthInput.style.background = savedColor;
  }
}

displayPassLength();