let timeLeft = 30;
let timerInterval;
let audioElement;

function startTimer() {
  audioElement = document.getElementById("time-up-audio");
  audioElement.volume = 0.3;
  audioElement.play(); // toca o áudio ao mesmo tempo que o timer começa
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('time-left').innerHTML = timeLeft + '';
    localStorage.setItem('timeLeft', timeLeft); // armazena o estado do timer
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      audioElement.pause(); // para o áudio quando o timer chega a 0
      audioElement.currentTime = 0; // volta o áudio para o início
      alert('Time\'s up!');
    }
  }, 1000); // 1000ms = 1 second
}

function resetTimer() {
  timeLeft = 30; // reseta o timer
  localStorage.removeItem('timeLeft'); // remove o estado do timer
  audioElement.pause(); // para o áudio
  audioElement.currentTime = 0; // volta o áudio para o início
}

// Carrega o estado do timer do localStorage
if (localStorage.getItem('timeLeft')) {
  timeLeft = parseInt(localStorage.getItem('timeLeft'));
}

// Initialize the timer when the page loads
window.onload = startTimer;

// Reset the timer when the page is updated
window.onbeforeunload = resetTimer;

function exibirNumeros() {
    // Selecionar os spans com os números
    const spans = document.querySelectorAll('span[id^="numero"]');
    const aside = document.querySelector('aside.numberList');
    const takenPositions = []; // array to store the positions of the previously placed spans
  
    // Função para gerar uma posição aleatória
    function getRandomPosition() {
      const maxX = Math.min(window.innerWidth, 1000) + 100; // ajuste para evitar que os números fiquem muito próximos da borda
      const maxY = Math.min(window.innerHeight, 500) + 100; // ajuste para evitar que os números fiquem muito próximos da borda
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
          takenPositions.push({ x, y }); // add the new position to the taken positions array
          return { x, y };
        }
      } while (true);
    }
  
    // função para calcular a distância entre dois pontos
    function distance(pos1, pos2) {
      return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
    }
  
    // Loop para posicionar os spans aleatoriamente
    spans.forEach((span) => {
      const position = getRandomPosition();
      span.style.position = 'absolute';
      span.style.top = `${position.y}px`;
      span.style.left = `${position.x}px`;
  
      // Adicionar evento de click a cada span
      span.addEventListener('click', () => {
        audio.play();
        span.style.opacity = 1; // set opacity to 1
        aside.appendChild(span); // move the span to the aside element
        span.style.position = 'relative'; // reset position to relative
        span.style.top = '0px'; // reset top position
        span.style.left = '0px'; // reset left position
      });
    });
  }
  
  document.addEventListener('DOMContentLoaded', exibirNumeros);

  