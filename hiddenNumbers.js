let timeLeft = 30;
let timerInterval;
let audioElement;
let remainingAttempts = 3;
let hits = 0;
let gameRunning = false; // variável para controlar se o jogo está em andamento
let audio; // variável para armazenar o elemento de áudio de martelo

// Inicialização do timer
function startTimer() {
  audioElement = document.getElementById("time-up-audio");
  audioElement.volume = 0.3;
  audioElement.play();
  gameRunning = true;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('time-left').innerHTML = `${timeLeft}s`;
    localStorage.setItem('timeLeft', timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      audioElement.pause();
      audioElement.currentTime = 0;
      // showModal("Seu tempo acabou", "path/to/time-up-image.jpg");
      resetGame();
    }
  }, 1000);
}


// Reset do timer
function resetTimer() {
  timeLeft = 30;
  localStorage.removeItem('timeLeft');
  audioElement.pause();
  audioElement.currentTime = 0;
}

// Diminui o número de tentativas
function decreaseAttempts() {
  if (gameRunning) {
    remainingAttempts--;
    document.getElementById('remaining-attempts').textContent = `${remainingAttempts} / 3`;
    if (remainingAttempts === 0) {
      showModal("", "assets/aviso-derrota.png");
      resetGame();
    }
  }
}

// Aumenta o número de acertos
function increaseHits() {
  hits++;
  document.getElementById('hits-').textContent = `${hits} / 11`;
  if (hits === 11) {
    showModal('','assets/ganhador.png');
    resetGame();
  }
}

// Reseta o jogo
function resetGame() {
  clearInterval(timerInterval);
  resetTimer();
  gameRunning = false;
  remainingAttempts = 3;
  hits = 0;
  document.getElementById('remaining-attempts').textContent = `${remainingAttempts} / 3`;
  document.getElementById('hits-').textContent = `0 / 11`;
  exibirNumeros();
}

// Função para exibir modais
function showModal(message, imageUrl) {
  const modal = document.getElementById('game-modal');
  const modalMessage = document.getElementById('modal-message');
  const modalImage = document.getElementById('modal-image');
  const closeModal = document.getElementById('close-modal');

  modalMessage.textContent = message;
  modalImage.src = imageUrl;
  modal.style.display = 'block';

  closeModal.onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

const customCursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.pageX}px`;
    customCursor.style.top = `${e.pageY}px`;
    customCursor.style.display = 'block'; // Mostrar o cursor personalizado
});

document.addEventListener('mousedown', () => {
    document.body.classList.add('hammer-click');
    customCursor.classList.add('hammer-click');
});

document.addEventListener('mouseup', () => {
    document.body.classList.remove('hammer-click');
    customCursor.classList.remove('hammer-click');
});


// Inicialização do jogo: carrega elementos e inicia o timer
document.addEventListener('DOMContentLoaded', () => {
  exibirNumeros();
  startTimer();
});

// Função para exibir números na tela
function exibirNumeros() {
  audio = new Audio('assets/martelo.mp3');
  const spans = document.querySelectorAll('span.numero');
  const aside = document.querySelector('aside.numberList');
  aside.innerHTML = '';

  const takenPositions = [];

  function getRandomPosition() {
    const maxX = Math.min(window.innerWidth, 1000) + 100;
    const maxY = Math.min(window.innerHeight, 500) + 100;
    let x, y;
    do {
      x = Math.floor(Math.random() * maxX);
      y = Math.floor(Math.random() * maxY);
      let isValidPosition = true;
      for (const pos of takenPositions) {
        if (distance(pos, { x, y }) < 50) {
          isValidPosition = false;
          break;
        }
      }
      if (isValidPosition) {
        takenPositions.push({ x, y });
        return { x, y };
      }
    } while (true);
  }

  function distance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
  }

  spans.forEach((span) => {
    const position = getRandomPosition();
    span.style.position = 'absolute';
    span.style.top = `${position.y}px`;
    span.style.left = `${position.x}px`;

    span.onclick = function() {
      if (gameRunning) {
        audio.play();
        span.style.opacity = 1;
        span.style.color = '#ffffff';
        aside.appendChild(span);
        span.style.position = 'relative';
        span.style.top = '0px';
        span.style.left = '0px';
        increaseHits();
      }
    };
  });

  document.body.addEventListener('click', (event) => {
    if (gameRunning) {
      const clickedElement = event.target;
      if (clickedElement.tagName === 'SECTION') {
        decreaseAttempts();
      }
    }
  });
};
