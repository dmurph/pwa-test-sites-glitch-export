'use strict';

function print(text) {
  output.textContent += text;
}

function printLn(text) {
  print(text + '\n');
}

async function main() {
  printLn('Start.');

  print('Awaiting service worker...');
  await navigator.serviceWorker.register('serviceworker.js');
  await navigator.serviceWorker.ready;
  printLn('done.');

  let manifest = readLSManifest();
  printLn(manifest ? 'LS manifest found.' : 'No LS manifest.');
  
  if (!manifest) {
    manifest = readControlsManifest();
    printLn('Read controls manifest.');
  }

  updateSW(manifest);
  updateLS(manifest);
  updateControls(manifest);
  updateDisplay(manifest);

  for (let select of document.querySelectorAll('select')) {
    select.addEventListener('change', controlsChanged);
  }

  printLn('End.');
}

function readLSManifest() {
  return JSON.parse(localStorage.getItem('manifest'));
}

function readControlsManifest() {
  return {
    name: appNameSelect.value,
    description: '6 star efficiency rated newt (1)',
    theme_color: themeColourSelect.value,
    display: displaySelect.value,
    display_override: JSON.parse(displayOverideSelect.value),
    scope: '.',
    start_url: '.',
    icons: [{
      src: iconSelect.value,
      sizes: '155x155',
      type: 'image/png',
    }],
  };
}

function updateDisplay(manifest) {
  title.textContent = manifest.name;
  appName.textContent = manifest.name;
  display.textContent = manifest.display;
  icon.src = manifest.icons[0].src;
  icon.style.borderColor = manifest.theme_color;
  printLn('Display updated.');
}

function updateControls(manifest) {
  appNameSelect.value = manifest.name;
  displaySelect.value = manifest.display;
  themeColourSelect.value = manifest.theme_color;
  iconSelect.value = manifest.icons[0].src;
  if (manifest.display_override != undefined) {
    console.log(JSON.stringify(manifest.display_override));
    displayOverideSelect.value = JSON.stringify(manifest.display_override);
  }
  manifestOutput.textContent = JSON.stringify(manifest, null, 2);
  printLn('Controls updated.');
}

function updateLS(manifest) {
  localStorage.setItem('manifest', JSON.stringify(manifest));
  printLn('LS updated.');
}

function updateSW(manifest) {
  if (!navigator.serviceWorker.controller) {
    printLn('SW update failed.');
    return;
  }
  navigator.serviceWorker.controller.postMessage(manifest);
  printLn('SW updated.');
}

function controlsChanged() {
  const manifest = readControlsManifest();
  updateSW(manifest);
  updateLS(manifest);
  updateDisplay(manifest);
}

main();