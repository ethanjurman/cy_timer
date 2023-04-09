let timers = JSON.parse(localStorage.getItem('timers')) || [];

function createTimer(timeMS) {
  const timerWrapper = document.createElement('div');
  timerWrapper.setAttribute('data-index', timers.length);
  timerWrapper.classList.add('timer-wrapper');

  const timerElement = document.createElement('div');
  timerElement.classList.add('timer');

  const timerDrain = document.createElement('div');
  timerDrain.classList.add('timer-drain');

  timerWrapper.appendChild(timerElement);
  timerWrapper.appendChild(timerDrain);
  document.body.appendChild(timerWrapper);

  timerWrapper.onclick = (event) => {
    let element = event.target;
    if (!element.classList.contains('timer-wrapper')) {
      element = event.target.parentElement;
    }
    index = element.getAttribute('data-index');
    timers.splice(index, 1);
    element.parentElement.removeChild(element);
  }

  const nowTime = new Date().getTime();
  timers.push({
    endTime: timeMS + nowTime,
    duration: timeMS
  });
}

function msToTime(duration) {
  const milliseconds = `${parseInt((duration % 1000)) % 100}`.padEnd(2, '0');
  const seconds = `${Math.floor((duration / 1000) % 60)}`.padStart(2, '0');
  const minutes = `${Math.floor((duration / (1000 * 60)) % 60)}`.padStart(2, '0');
  const hours = `${Math.floor((duration / (1000 * 60 * 60)) % 24)}`.padStart(2, '0');

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function updateTimers() {
  const timerDrainers = [...document.querySelectorAll('.timer-drain')];
  document.querySelectorAll('.timer').forEach((timerElement, index) => {
    const { endTime, duration } = timers[index];
    const newTime = endTime - new Date().getTime();

    const elapsed = newTime - new Date(0);
    const percentElapsed = (elapsed / duration) * 100;

    if (newTime > 0) {
      timerDrainers[index].style.width = `${100 - percentElapsed}%`
      timerElement.innerText = msToTime(newTime);
    } else {
      timerElement.innerText = msToTime(0);
    }
  });

  window.requestAnimationFrame(updateTimers)
}

createTimer(10000);
createTimer(60000);
createTimer(600000);

window.requestAnimationFrame(updateTimers)