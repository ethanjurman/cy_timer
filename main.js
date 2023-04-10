let timerIndex = 0;
let timers = JSON.parse(localStorage.getItem('timers')) || [];
let isPaused = false;
let pauseTime = null;
let isEditingText = false;
let isButtonsHidden = false;

if (timers.length > 0) {
  timers.forEach((timer, index) => createTimer(timer.duration, timer.endTime, `${index}`));
}

function createTimer(timeMS, endTime, forcedIndex) {
  const timerWrapper = document.createElement('div');
  timerWrapper.setAttribute('data-index', forcedIndex || timers.length);
  timerWrapper.classList.add('timer-wrapper');

  const timerElement = document.createElement('div');
  timerElement.classList.add('timer');

  const timerDrain = document.createElement('div');
  timerDrain.classList.add('timer-drain');

  const timerName = document.createElement('div');
  timerName.classList.add('timer-name');
  timerName.setAttribute('data-content', timerIndex.toString().padStart(2, '0'));
  timerIndex += 1;

  timerWrapper.appendChild(timerName);
  timerWrapper.appendChild(timerElement);
  timerWrapper.appendChild(timerDrain);
  document.querySelector('.timers-container').appendChild(timerWrapper);

  timerName.onclick = (event) => {
    if (isEditingText) {
      isEditingText = false;
      timerName.classList.remove('text-edit');
      return;
    }

    isEditingText = true;
    timerName.classList.add('text-edit');
    event.preventDefault();
  }

  timerWrapper.onclick = (event) => {
    let element = event.target;
    if (element.classList.contains('timer-name') || isEditingText) {
      return;
    }
    if (!element.classList.contains('timer-wrapper')) {
      element = event.target.parentElement;
    }
    index = element.getAttribute('data-index');
    timers.splice(index, 1);
    element.parentElement.removeChild(element);

    // update other timers by subtracting all of them by 1 if they were above the index
    document.querySelectorAll('.timer-wrapper').forEach(timerElement => {
      const currentIndex = Number(timerElement.getAttribute('data-index'));
      if (currentIndex > index) {
        timerElement.setAttribute('data-index', currentIndex - 1)
      }
    })
  }

  if (endTime) {
    // if endTime is provided, this is already in the timer object
    return;
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

function updateTimers({ forceUpdate = false }) {
  if (isPaused && !forceUpdate) {
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

  // when we can, save the timers
  setTimeout(() => {
    localStorage.setItem("timers", JSON.stringify(timers));
  }, 0);

  if (!forceUpdate) {
    window.requestAnimationFrame(updateTimers);
  }
}

function pauseTimers() {
  isPaused = true;
  pauseTime = new Date().getTime();
  document.querySelector('.pause-text').style.opacity = '1';
}

function resumeTimers() {
  const resumeTime = new Date().getTime();
  timers = timers.map((timer) => {
    return {
      endTime: timer.endTime + (resumeTime - pauseTime),
      duration: timer.duration
    }

  })
  isPaused = false;
  pauseTime = null;
  document.querySelector('.pause-text').style.opacity = '0';
}

function divideTimers() {
  timers.forEach((timer, index) => {
    timers[index].endTime = timer.endTime - timer.duration / 2;
  })

  if (isPaused) {
    resumeTimers();
    updateTimers({ forceUpdate: true });
    pauseTimers();
  }
}

function shrinkTimers(multiplier = 1) {
  timers.forEach((_timer, index) => {
    timers[index].endTime -= 6000 * multiplier;
  })
  if (isPaused) {
    resumeTimers();
    updateTimers({ forceUpdate: true });
    pauseTimers();
  }
}

function extendTimers(multiplier = 1) {
  timers.forEach((_timer, index) => {
    timers[index].endTime += 6000 * multiplier;
  })
  if (isPaused) {
    resumeTimers();
    updateTimers({ forceUpdate: true });
    pauseTimers();
  }
}

function deleteTimers() {
  timers = [];
  document.querySelectorAll('.timer-wrapper').forEach(timerElement => {
    timerElement.parentElement.removeChild(timerElement);
  })
}

addEventListener('keydown', (event) => {
  if (isEditingText) {
    return updateTimerTitle(event.key);
  }
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
  if (event.key === 'Escape') {
    return deleteTimers();
  }
  if (event.key === 'h') {
    if (isButtonsHidden) {
      isButtonsHidden = false;
      document.querySelectorAll('.add-timer-button').forEach((e, index) => setTimeout(() => e.classList.remove('button-hide'), index * 50));
    } else {
      isButtonsHidden = true;
      document.querySelectorAll('.add-timer-button').forEach((e, index) => setTimeout(() => e.classList.add('button-hide'), index * 50));
    }
  }
  if (event.key === '1') { createTimer(60000) }
  if (event.key === '2') { createTimer(60000 * 5) }
  if (event.key === '3') { createTimer(60000 * 10) }
  if (event.key === '4') { createTimer(60000 * 30) }
  if (event.key === '5') { createTimer(60000 * 60) }
  if (event.key === '6') { createTimer(60000 * 60 * 4) }
  if (event.key === '7') { createTimer(60000 * 60 * 8) }
  if (event.key === '8') { createTimer(60000 * 60 * 16) }
})

function updateTimerTitle(key) {
  const editTextElement = document.querySelector('.text-edit');
  const text = editTextElement.getAttribute('data-content');
  if (key === 'Backspace') {
    return editTextElement.setAttribute('data-content', text.slice(0, text.length - 1));
  }
  if (key === 'Enter') {
    isEditingText = false;
    editTextElement.classList.remove('text-edit');
  }
  if (key === ' ') {
    return editTextElement.setAttribute('data-content', text + '_');
  }
  if (key.length > 1) {
    return; // ignore special characters and strings
  }
  return editTextElement.setAttribute('data-content', text + key);

}

document.querySelectorAll('.add-timer-button').forEach(addTimerButton => {
  addTimerButton.addEventListener('click', (e) => {
    createTimer(Number(addTimerButton.getAttribute('data-time')));
  });
})


window.requestAnimationFrame(updateTimers)