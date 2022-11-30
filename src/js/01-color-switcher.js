const refs = {
  buttonStart: document.querySelector('[data-start]'),
  buttonStop: document.querySelector('[data-stop]'),
  body: document.querySelector('body'),
};

const TIME_CHANGE = 1000;
let timerId = null;
refs.buttonStop.disabled = true;

refs.buttonStart.addEventListener('click', onStartChangeColor);
refs.buttonStop.addEventListener('click', onStoptChangeColor);

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function onGetColorBody() {
  const colorBody = getRandomHexColor();
  refs.body.style.backgroundColor = colorBody;
}

function onStartChangeColor() {
  toggleDisableButton(true, false);
  timerId = setInterval(onGetColorBody, TIME_CHANGE);
}

function onStoptChangeColor() {
  toggleDisableButton(false, true);
  clearInterval(timerId);
}

function toggleDisableButton(buttonStart, buttonStop) {
  refs.buttonStart.disabled = buttonStart;
  refs.buttonStop.disabled = buttonStop;
}
