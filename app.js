const amountInput = document.querySelector(".amount-input");
const amountError = document.querySelector(".amount-error");
const amountIcon = document.querySelector(".amount-icon");

const termInput = document.querySelector(".term-input");
const termError = document.querySelector(".term-error");
const termIcon = document.querySelector(".term-icon");

const rateInput = document.querySelector(".rate-input");
const rateError = document.querySelector(".rate-error");
const rateIcon = document.querySelector(".rate-icon");

const radioError = document.querySelector(".radio-error");
const radioBtns = document.querySelectorAll(".radio");

const monthlyValue = document.querySelector('.monthly-value')
const totalValue = document.querySelector('.total-value')

const empty = document.querySelector('.empty')
const results = document.querySelector('.results')

let mortgageAmount = 0;
let mortgageTerm = 0;
let interestRate = 0;

// Formatting input value with comas
function formatNumberWithCommas(value) {
  // Removes all commas
  const numericValue = value.replace(/,/g, '');
  
  // Adds commas every 3 digits
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// A function that takes a pure numeric value (without commas)
function getNumericValue(input) {
  return input.value.replace(/,/g, '');
}

// Event listener to format amountInput while typing
amountInput.addEventListener('input', (e) => {
  // Save the cursor position
  const cursorPosition = e.target.selectionStart;
  const oldLength = e.target.value.length;
  
  // Remove all commas and leave only numbers
  const numericValue = e.target.value.replace(/,/g, '');
  
  // Format value with commas
  const formattedValue = formatNumberWithCommas(numericValue);
  
  // Set formatted value
  e.target.value = formattedValue;
  
  // Correct cursor position after adding commas
  const newLength = formattedValue.length;
  const diff = newLength - oldLength;
  e.target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
});

// Function displaying error states
function showErrorState(inputElement, errorElement, iconElement) {
  inputElement.classList.add("error-input");
  inputElement.classList.remove("hide-error-input");
  errorElement.classList.add("error-active");
  errorElement.classList.remove("error-hidden");
  iconElement.classList.add("error-input-icon");
  iconElement.classList.remove("hide-error-input-icon");
}

// Function for removing SPECIFIC error states
function hideErrorState(inputElement, errorElement, iconElement) {
  inputElement.classList.remove("error-input");
  inputElement.classList.add("hide-error-input");
  errorElement.classList.remove("error-active");
  errorElement.classList.add("error-hidden");
  iconElement.classList.remove("error-input-icon");
  iconElement.classList.add("hide-error-input-icon");
}

// Function for removing ALL! error states
function hideAllErrors() {
  hideErrorState(amountInput, amountError, amountIcon);
  hideErrorState(termInput, termError, termIcon);
  hideErrorState(rateInput, rateError, rateIcon);
  radioError.classList.remove("error-active");
}

function numbersOnly(e) {
  // Allows to use the keys Backspace, Delete, Tab, Escape, Enter, arrows
  if (
    [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
    ].includes(e.key) ||
    // Allows to use Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
  ) {
    return;
  }

  if (e.key === '.' && e.target === rateInput) {
    if (rateInput.value.includes('.')) {
      e.preventDefault();
    }
    return
  }

  if (e.key === '.' && e.target === termInput) {
    e.preventDefault();
    return
  }

  // Allows to enter only numbers
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
}

// Prevents letter pasting
function preventPasting(e) {
  const pasted = (e.clipboardData || window.clipboardData).getData("text");

  if (e.target === rateInput) {
    if (!/^\d*\.?\d*$/.test(pasted) || (pasted.match(/\./g) || []).length > 1) {
      e.preventDefault();
    }
  } else {
    if (!/^\d+$/.test(pasted)) {
      e.preventDefault();
    }
  } 
}

// Calculating monthly repayments function with getNumericValue function
function calculateMonthly() {
  const mortgageAmount = parseFloat(getNumericValue(amountInput)) // getNumericValues function
  const mortgageTerm = parseFloat(termInput.value) * 12
  const interestRate = (parseFloat(rateInput.value) / 100) / 12

  if (mortgageAmount > 0 && mortgageTerm > 0 && interestRate > 0) {
    const pow = Math.pow(1 + interestRate, mortgageTerm)

    // Formula for calculating monthly repayments
    const monthlyRep = ((mortgageAmount * (interestRate * pow)) / (pow - 1))

    const totalRep =  monthlyRep * mortgageTerm

    // Uses toLocaleString( ) to format the results
    monthlyValue.innerHTML = `£${monthlyRep.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    console.log(`${monthlyRep}`)
    totalValue.innerHTML = `£${totalRep.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  } else {
    monthlyValue.innerHTML = '' 
    console.log('calculation error')
  }
   
  console.log(`Mortgage Amount: ${mortgageAmount}`)
  console.log(`Mortgage Term: ${mortgageTerm}`)
  console.log(`Mortgage Interest Rate: ${interestRate}`)
}

function emptyCardShow() {
    empty.style.display = 'block'
    results.style.display = 'none' 
  }

  function resultCardShow() {
    results.style.display = 'block' 
    empty.style.display = 'none' 
  }

function validateForm() {
  if (getNumericValue(amountInput).trim() === "") { // Uses getNumericValue() for amountInput
    showErrorState(amountInput, amountError, amountIcon);
    emptyCardShow()
  } else {
    resultCardShow()
  }

  // Removes error states when input is not empty
  amountInput.addEventListener("input", () => {
    if (getNumericValue(amountInput).trim() !== "") { // Uses getNumericValue() for amountInput
      hideErrorState(amountInput, amountError, amountIcon);
    }
  });

  if (termInput.value.trim() === "") {
    showErrorState(termInput, termError, termIcon);
    emptyCardShow()
  } else {
    resultCardShow()
  }

  termInput.addEventListener("input", () => {
    if (termInput.value.trim() !== "") {
      hideErrorState(termInput, termError, termIcon);
    }
  });

  if (rateInput.value.trim() === "") {
    showErrorState(rateInput, rateError, rateIcon);
    emptyCardShow()
  } else {
    resultCardShow()
  }

  rateInput.addEventListener("input", () => {
    if (rateInput.value.trim() !== "") {
      hideErrorState(rateInput, rateError, rateIcon);
    }
  });

  calculateMonthly()

  // Checks if any radio button is selected
  const isAnyRadioChecked = Array.from(radioBtns).some(
    (radio) => radio.checked
  );

  // Clears error states after selecting a radio
  radioBtns.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.checked) {
        radioError.classList.remove("error-active");
      } else {
        
      }
    });
  });

  if (!isAnyRadioChecked) {
    radioError.classList.add("error-active");
    emptyCardShow()
    return false;
  }
}

const radioItems = document.querySelectorAll('.radio-item');

// Adds event listener to every radio-item
radioItems.forEach(item => {
  // Adds tabindex to enable focus on the div
  item.setAttribute('tabindex', '0');

  item.addEventListener('click', function() {
    const radioInput = this.querySelector('.radio');
    
    // Select radio input
    if (radioInput) {
      radioInput.checked = true;
      radioError.classList.remove("error-active");
    }
  });

  item.addEventListener('keydown', function(e) {

    // Check if Enter or Space was pressed
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); 
      
      const radioInput = this.querySelector('.radio');
      if (radioInput) {
        radioInput.checked = true;
      }
    }
  });
});

// Global arrow navigation for all form elements
const allFormElements = document.querySelectorAll('.text-input, .radio-item, .submit-btn, .reset-btn');

document.addEventListener('keydown', function(e) {
  const focusedElement = document.activeElement;
  const currentIndex = Array.from(allFormElements).indexOf(focusedElement);
  
  if (currentIndex === -1) return;
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const nextIndex = (currentIndex + 1) % allFormElements.length;
    allFormElements[nextIndex].focus();
  }
  
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prevIndex = (currentIndex - 1 + allFormElements.length) % allFormElements.length;
    allFormElements[prevIndex].focus();
  }
});

// Activating the form submission button with Enter
document.addEventListener("keydown", (event) => {
  const submitBtn = document.querySelector(".submit-btn");

  if (event.key === "Enter") {
    event.preventDefault();

    if (submitBtn) {
      validateForm();
    }
  }
});

// Adds the numbersOnly function to all text inputs
document.querySelectorAll(".text-input").forEach((input) => {
  input.addEventListener("keydown", (e) => {
    numbersOnly(e);
  });
});

termInput.addEventListener('input', () => {
  let value = parseInt(termInput.value)

  if (termInput.value !== '' && !isNaN(value)) {
    if (value > 35) {
      termInput.value = '35'
    } else if (value < 1 && termInput.value.length > 0) {
      termInput.value = '1'
    }
  }
})

rateInput.addEventListener('input', () => {
  let value = parseInt(rateInput.value)

  if (rateInput.value !== '' && !isNaN(value)) {
    if (value > 100) {
      rateInput.value = '100'
    }
  }
})

// Adds the preventPasting function to all text inputs
document.querySelectorAll(".text-input").forEach((input) => {
  input.addEventListener("paste", (e) => {
    preventPasting(e);
  });
});

// Clears all inputs and error states (Clear All button)
document.querySelector(".reset-btn").addEventListener("click", () => {
  amountInput.value = "";
  termInput.value = "";
  rateInput.value = "";
  radioBtns.forEach((radio) => {
    radio.checked = false;
  });

  monthlyValue.innerHTML = '£0.000.00'
  totalValue.innerHTML = '£000,000.00'

  hideAllErrors();
  emptyCardShow()
});