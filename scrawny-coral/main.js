'use strict';

let colour = 'dog';
function updateColour(time = 0) {
  colour = colour == 'white' ? 'red' : 'white';
  coralguy.style.transform = `scale(${Math.random() * 10 + 1}) rotate(${Math.random()*360}deg)`;
  themeColor.content = colour;
  document.body.style.backgroundColor = colour;
  requestAnimationFrame(updateColour);
}

async function main() {
  await navigator.serviceWorker.register('serviceworker.js');
  updateColour();
}

main();