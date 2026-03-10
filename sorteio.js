/*---------------------------------------
 DOM Functions
---------------------------------------*/

const startInput = document.getElementById('startNumber');
const endInput = document.getElementById('endNumber');
const btnDraw = document.getElementById('btnDrawNumber');
const result = document.getElementById('drawResult');
const sound = document.getElementById('drawSound');
const jackpotSound = document.getElementById('jackpotSound');
const fade = document.querySelector('#fade');
const modalTitle = document.querySelector('#message h4');
const modalMessage = document.querySelector('#message p');
const btnClose = document.querySelector('#closeMessage');
const historyList = document.getElementById('historyList');
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function launchConfetti() {
  const pieces = [];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`,
    });
  }

  let frames = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach((p) => {
      p.y += p.speed;
      p.x += Math.sin(p.angle);

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    frames++;

    if (frames < 80) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

let history = [];

function addToHistory(number) {
  history.unshift(number);

  if (history.length > 5) {
    history.pop();
  }

  historyList.innerHTML = '';

  history.forEach((n) => {
    const li = document.createElement('li');
    li.textContent = n;
    historyList.appendChild(li);
  });
}

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

  if (drawing) return;

  drawing = true;

  btnDraw.disabled = true;
  btnDraw.value = 'Sorteando...';

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

      addToHistory(finalNumber);

      if (finalNumber === end) {
        launchConfetti();
        if (jackpotSound) {
          jackpotSound.currentTime = 0;
          jackpotSound.play().catch(() => {});
        }
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
