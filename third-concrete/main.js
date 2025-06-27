import State from '/state.js';
import Output from '/output.js';

window.addEventListener('keydown', ({key}) => {
  switch (key) {
    case 'ArrowLeft':
      State.timeTravel(-1);
      Output.render();
      break;
    case 'ArrowRight':
      State.timeTravel(1);
      Output.render();
      break;
  }
});

Output.render();
