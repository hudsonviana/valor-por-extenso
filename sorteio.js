const startInput = document.getElementById('startNumber');
const endInput = document.getElementById('endNumber');
const btnDraw = document.getElementById('btnDrawNumber');
const result = document.getElementById('drawResult');

btnDraw.addEventListener('click', () => {
  const start = parseInt(startInput.value);
  const end = parseInt(endInput.value);

  if (isNaN(start) || isNaN(end)) {
    result.value = 'Informe os dois valores.';
    return;
  }

  if (start > end) {
    result.value = 'O valor inicial não pode ser maior que o final.';
    return;
  }

  const randomNumber = Math.floor(Math.random() * (end - start + 1)) + start;

  result.value = randomNumber;
});

document.addEventListener('DOMContentLoaded', () => {
  const element = document.querySelector('.currentYear');

  if (element) {
    element.textContent = new Date().getFullYear();
  }
});

/*---------------------------------------
  Menu
---------------------------------------*/

const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');

menuBtn.addEventListener('click', () => {
  sideMenu.classList.toggle('open');
  menuOverlay.classList.toggle('visible');
});

menuOverlay.addEventListener('click', () => {
  sideMenu.classList.remove('open');
  menuOverlay.classList.remove('visible');
});
