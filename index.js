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

function amountToWords(amount) {
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

// const numTest = 60900001.0;
// console.log(amountToWords(numTest));

/*---------------------------------------
 Dom Functions
---------------------------------------*/

const inputAmount = document.querySelector('#amount');
const response = document.querySelector('#response');
const btnCopy = document.querySelector('#btnCopyText');
const copiedTag = document.querySelector('.copiedTag');
const btnWrite = document.querySelector('#btnWriteAmountWords');

inputAmount.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    btnWrite.click();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const element = document.querySelector('.currentYear');

  if (element) {
    element.textContent = new Date().getFullYear();
  }
  inputAmount.focus();
});

btnCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(response.value);

  copiedTag.style.display = 'flex';

  setTimeout(() => {
    copiedTag.style.display = 'none';
  }, 2000);
});

// inputAmount.addEventListener('input', () => {
//   let value = inputAmount.value.replace(/\D/g, '');

//   value = (Number(value) / 100).toLocaleString('pt-BR', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

//   inputAmount.value = value;
// });
