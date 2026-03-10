/*---------------------------------------
 DOM Functions
---------------------------------------*/

const startInput = document.getElementById('startNumber');
const endInput = document.getElementById('endNumber');
const btnDraw = document.getElementById('btnDrawNumber');
const result = document.getElementById('drawResult');
const track = result.querySelector('.slotTrack');
const sound = document.getElementById('drawSound');

btnDraw.addEventListener('click', () => {
  const start = parseInt(startInput.value);
  const end = parseInt(endInput.value);

  if (isNaN(start) || isNaN(end)) {
    result.textContent = 'Informe os dois valores.';
    return;
  }

  if (start > end) {
    result.textContent = 'O valor inicial não pode ser maior que o final.';
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
