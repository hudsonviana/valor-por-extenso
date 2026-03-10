/*---------------------------------------
 DOM Functions
---------------------------------------*/

const startInput = document.getElementById('startNumber');
const endInput = document.getElementById('endNumber');
const btnDraw = document.getElementById('btnDrawNumber');
const result = document.getElementById('drawResult');
const sound = document.getElementById('drawSound');
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

btnClose.addEventListener('click', () => {
  closeModalMessage();
});

let drawing = false;
btnDraw.addEventListener('click', () => {
  if (drawing) return;

  drawing = true;

  btnDraw.disabled = true;
  btnDraw.value = 'Sorteando...';

  const start = parseInt(startInput.value);
  const end = parseInt(endInput.value);

  if (Number.isNaN(start) || Number.isNaN(end)) {
    showModalMessage('ERRO', 'Valor inválido ou inexistente');
    return;
  }

  if (start < 1 || end < 1 || start > 99 || end > 99) {
    showModalMessage('ERRO', 'Os valores devem estar entre 1 e 99');
    return;
  }

  if (start >= end) {
    showModalMessage('ERRO', 'O valor inicial deve ser menor que o final');
    return;
  }

  if (end - start < 1) {
    showModalMessage('ERRO', 'Intervalo muito pequeno para sorteio');
    return;
  }

  const finalNumber = Math.floor(Math.random() * (end - start + 1)) + start;

  let cycles = 0;
  const maxCycles = 18;
  let delay = 40;

  // remover estado anterior
  result.classList.remove('final');

  // iniciar animação
  result.classList.add('spinning');

  // inicia som
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  function spin() {
    const tempNumber = Math.floor(Math.random() * (end - start + 1)) + start;

    result.textContent = tempNumber;

    cycles++;

    if (cycles >= maxCycles) {
      result.textContent = finalNumber;

      // parar animação
      result.classList.remove('spinning');
      result.classList.add('final');

      // parar som
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }

      drawing = false;

      btnDraw.disabled = false;
      btnDraw.value = 'Sortear número';

      return;
    }

    delay += 8;

    setTimeout(spin, delay);
  }

  spin();
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
