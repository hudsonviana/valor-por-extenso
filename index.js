/**
 * Desenvolvido por Hudson Andrade Viana
 * em 21 de janeiro de 2024.
 * Atualizado em 06 de março de 2026.
 */

/*---------------------------------------
 Main Functions
---------------------------------------*/
const ones = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
const tens = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

function getWords(value) {
  if (value < 20) {
    return ones[value];
  }

  if (value < 100) {
    const ten = Math.floor(value / 10);
    const unit = value % 10;
    return unit === 0 ? tens[ten] : `${tens[ten]} e ${ones[unit]}`;
  }

  if (value === 100) {
    return 'cem';
  }

  const hundred = Math.floor(value / 100);
  const reminder = value % 100;
  const hundredWord = hundreds[hundred];
  return reminder === 0 ? hundredWord : `${hundredWord} e ${getWords(reminder)}`;
}

function splitAmountIntoClasses(value) {
  const classes = [];
  while (value > 0) {
    classes.unshift(value % 1000);
    value = Math.floor(value / 1000);
  }
  return classes;
}

function getClassName(value, order) {
  const singular = value === 1;
  const classNames = {
    2: 'mil',
    3: singular ? 'milhão' : 'milhões',
    4: singular ? 'bilhão' : 'bilhões',
    5: singular ? 'trilhão' : 'trilhões',
  };
  return value !== 0 ? classNames[order] : null;
}

function getClassSeparator(className, reminder) {
  if (!className) return null;
  if (className !== 'mil' && !reminder) return 'de';
  if ((reminder > 1000 && reminder % 1000 !== 0) || (reminder > 100 && reminder % 100 !== 0)) return ',';
  if (reminder && (reminder <= 100 || reminder % 100 === 0)) return 'e';
  return null;
}

function getAmountInWords(amount) {
  const result = [];
  const stringAmount = String(amount.toFixed(2));
  const [integerAmount, fractionAmount] = stringAmount.split('.').map(Number);

  const integerCurrency = integerAmount === 1 ? 'real' : 'reais';
  const fractionCurrency = fractionAmount === 1 ? 'centavo' : 'centavos';

  if (integerAmount > 0) {
    const classes = splitAmountIntoClasses(integerAmount);
    let order = classes.length;

    for (const [index, value] of classes.entries()) {
      const integerWords = getWords(value);
      const className = getClassName(value, order);
      const reminder = Number(classes.slice(index + 1).join(''));
      const separator = getClassSeparator(className, reminder);

      result.push(integerWords);
      result.push(className);
      result.push(separator);

      order--;
    }

    result.push(integerCurrency);
  }

  if (fractionAmount > 0) {
    if (integerAmount > 0) result.push('e');
    const fractionWords = getWords(fractionAmount);

    result.push(fractionWords);
    result.push(fractionCurrency);
  }

  return result
    .filter(Boolean)
    .join(' ')
    .replace(/\s*,\s*/g, ', ');
}

/*---------------------------------------
 Dom Functions
---------------------------------------*/

const inputAmount = document.querySelector('#amount');
const btnWrite = document.querySelector('#btnWriteAmountWords');
const btnCopy = document.querySelector('#btnCopyText');
const response = document.querySelector('#response');
const copiedTag = document.querySelector('.copiedTag');
const fade = document.querySelector('#fade');
const modalTitle = document.querySelector('#message h4');
const modalMessage = document.querySelector('#message p');
const btnClose = document.querySelector('#closeMessage');

function showModalMessage(title, msg) {
  modalTitle.innerText = title;
  modalMessage.innerText = msg;
  fade.classList.remove('hide');
}

function closeModalMessage() {
  fade.classList.add('hide');
  modalTitle.innerText = '';
  modalMessage.innerText = '';
}

function parseAmount(inputAmount) {
  const amount = Number(inputAmount.replace(/\./g, '').replace(',', '.').replace('R$', '').trim());
  return amount;
}

function formatAmount(amount) {
  const currencyAmount = amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  return currencyAmount;
}

function typeWriter(element, text, speed = 30) {
  element.value = '';
  let index = 0;

  const interval = setInterval(() => {
    element.value += text.charAt(index);
    index++;

    if (index >= text.length) {
      clearInterval(interval);
    }
  }, speed);
}

btnClose.addEventListener('click', () => {
  closeModalMessage();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModalMessage();
    inputAmount.focus();
  }
});

inputAmount.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    btnWrite.click();
  }

  if (event.key === '.') {
    event.preventDefault();
  }
});

inputAmount.addEventListener('input', () => {
  response.value = '';
});

btnWrite.addEventListener('click', () => {
  const amount = parseAmount(inputAmount.value);

  if (Number.isNaN(amount) || amount <= 0) {
    showModalMessage('ERRO', 'Valor inválido ou inexistente.');
    return;
  }

  if (amount > 999999999999999) {
    showModalMessage('ERRO', 'O valor fornecido é grande demais para ser escrito por extenso.');
    return;
  }

  inputAmount.value = formatAmount(amount);

  const amountInWords = getAmountInWords(amount);
  response.value = amountInWords;
  // typeWriter(response, amountInWords, 25);
});

btnCopy.addEventListener('click', () => {
  if (!response.value) return;

  let amountText = inputAmount.value.trim();
  if (!amountText.startsWith('R$')) {
    amountText = `R$ ${amountText}`;
  }

  const fullText = `${amountText} (${response.value})`;

  navigator.clipboard.writeText(fullText);

  copiedTag.classList.add('visible');

  setTimeout(() => {
    copiedTag.classList.remove('visible');
  }, 2000);
});

document.addEventListener('DOMContentLoaded', () => {
  const element = document.querySelector('.currentYear');

  if (element) {
    element.textContent = new Date().getFullYear();
  }

  inputAmount.focus();

  // const preventZoom = (e) => {
  //   if (e.touches && e.touches.length > 1) {
  //     e.preventDefault();
  //   }
  // };

  // document.addEventListener('gesturestart', (e) => e.preventDefault());
  // document.addEventListener('touchmove', preventZoom, { passive: false });
});
