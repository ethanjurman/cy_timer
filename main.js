let timers = JSON.parse(localStorage.getItem('timers')) || [];
let isPaused = false;
let pauseTime = null;

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
  if (isPaused) {
    window.requestAnimationFrame(updateTimers);
    return;
  }

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
      timerDrainers[index].style.width = '100%'
      timerElement.innerText = msToTime(0);
    }
  });

  window.requestAnimationFrame(updateTimers);
}

function pauseTimers() {
  console.log('resuming timers');
  isPaused = true;
  pauseTime = new Date().getTime();
}

function resumeTimers() {
  console.log('resuming timers');
  const resumeTime = new Date().getTime();
  timers = timers.map((timer) => {
    return {
      endTime: timer.endTime + (resumeTime - pauseTime),
      duration: timer.duration
    }

  })
  isPaused = false;
  pauseTime = null;
}

function divideTimers() {
  timers.forEach((timer, index) => {
    timers[index].endTime = timer.endTime - timer.duration / 2;
  })
}

function shrinkTimers(multiplier = 1) {
  timers.forEach((timer, index) => {
    timers[index].endTime -= 100 * multiplier;
    timers[index].duration -= 100 * multiplier;
  })
}

function extendTimers(multiplier = 1) {
  timers.forEach((timer, index) => {
    timers[index].endTime += 100 * multiplier;
    timers[index].duration += 100 * multiplier;
  })
}

addEventListener('keydown', (event) => {
  console.log(event.key);
  if (event.key === ']') {
    return extendTimers();
  }
  if (event.key === '[') {
    return shrinkTimers();
  }
  if (event.key === '>') {
    return extendTimers(10);
  }
  if (event.key === '<') {
    return shrinkTimers(10);
  }
  if (event.key === '/') {
    return divideTimers();
  }
  if (event.key === 'Enter' && !isPaused) {
    return pauseTimers();
  }
  if (event.key === 'Enter' && isPaused) {
    return resumeTimers();
  }
})

document.querySelector('.minute-1-timer').onclick = () => createTimer(60000)
document.querySelector('.minute-5-timer').onclick = () => createTimer(60000 * 5)
document.querySelector('.minute-10-timer').onclick = () => createTimer(60000 * 10)
document.querySelector('.minute-30-timer').onclick = () => createTimer(60000 * 30)
document.querySelector('.hour-1-timer').onclick = () => createTimer(60000 * 60)
document.querySelector('.hour-4-timer').onclick = () => createTimer(60000 * 60 * 4)
document.querySelector('.hour-8-timer').onclick = () => createTimer(60000 * 60 * 8)

window.requestAnimationFrame(updateTimers)