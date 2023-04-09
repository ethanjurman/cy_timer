let timers = JSON.parse(localStorage.getItem('timers')) || [];

function createTimer(timeMS) {
  const timerElement = document.createElement('div');
  timerElement.classList.add('timer');
  document.body.appendChild(timerElement);
  const nowTime = new Date().getTime();
  timers.push(timeMS + nowTime);
}

function msToTime(duration) {
  const milliseconds = `${parseInt((duration % 1000)) % 100}`.padEnd(2, '0');
  const seconds = `${Math.floor((duration / 1000) % 60)}`.padStart(2, '0');
  const minutes = `${Math.floor((duration / (1000 * 60)) % 60)}`.padStart(2, '0');
  const hours = `${Math.floor((duration / (1000 * 60 * 60)) % 24)}`.padStart(2, '0');
  console.log({ milliseconds, seconds, minutes, hours });
  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function updateTimers() {
  document.querySelectorAll('.timer').forEach((timerElement, index) => {
    const newTime = timers[index] - new Date().getTime();
    if (newTime > 0) {
      timerElement.innerText = msToTime(newTime);
    } else {
      timerElement.innerText = msToTime(0);
    }
  }
  );
  window.requestAnimationFrame(updateTimers)
}

createTimer(10000);
createTimer(60000);
createTimer(600000);

window.requestAnimationFrame(updateTimers)