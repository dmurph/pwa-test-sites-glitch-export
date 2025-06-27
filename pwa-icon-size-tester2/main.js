"use strict";

// Keep `displaySize`, and icon urls (whiteIcons, etc) up to date with this array.
let iconSizes = [16, 32, 48, 64, 96, 128, 256, 512];
let displaySize = [16, 24, 32, 38, 48, 55, 64, 80];
const IconTypes = {
	White: 0,
	Red: 1,
	Alternate: 2,
};
let whiteIcons = [
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/16x16.png?v=1641554229409",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/32x32.png?v=1641554190552",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/48x48.png?v=1641554307457",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/64x64.png?v=1641554207906",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/96x96.png?v=1641827535725",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/128x128.png?v=1641554154211",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/256x256.png?v=1641554144223",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/512x512.png?v=1641828774726",
];
let redIcons = [
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/16x16-red.png?v=1641554225034",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/32x32-red.png?v=1641554178003",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/48x48-red.png?v=1641554302332",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/64x64-red.png?v=1641554202230",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/96x96-red.png?v=1641827657230",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/128x128-red.png?v=1641554150356",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/256x256-red.png?v=1641554139992",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/512x512-red.png?v=1641828769740",
];
let altIcons = [
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/16x16-alt.png?v=1698686416590",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/32x32-alt.png?v=1698686379424",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/48x48-alt.png?v=1698686357730",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/64x64-alt.png?v=1698686318016",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/96x96-alt.png?v=1698686341051",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/128x128-alt.png?v=1698686296326",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/256x256-alt.png?v=1698688199773",
  "https://cdn.glitch.global/3b4345a7-2863-44f0-91f9-a2dc1f859cd1/512x512-alt.png?v=1698686231739",
];

function print(source, text) {
  console.log(source + ': ' + text);
}

function printLn(source, text) {
  print(source, text + "\n");
}

async function main() {
  printLn("main", "Function starts");

  print("main", "Awaiting service worker...");
  await navigator.serviceWorker.register("serviceworker.js");
  await navigator.serviceWorker.ready;
  printLn("main", "Done waiting.");

  let manifest = readLSManifest();
  printLn("main", manifest ? "LS manifest found." : "No LS manifest.");

  if (!manifest) {
    manifest = readControlsManifest();
    printLn("main", "Read controls manifest.");
  }

  updateServiceWorker(manifest);
  updateLocalStorage(manifest);
  updateControls(manifest);
  updateDisplay(manifest);

  for (let select of document.querySelectorAll("select")) {
    select.addEventListener("change", controlsChanged);
  }

  printLn("main", "Function ends.");
}

function readLSManifest() {
  return JSON.parse(localStorage.getItem("manifest"));
}

function readControlsManifest() {
  let manifest = {
    name: document.getElementById('appNameSelect').value,
    description: "A PWA to test icon sizes",
    background_color: "green",
    theme_color: "blue",
    display: "minimal-ui",
    scope: "/",
    start_url: "/",
    icons: []
  };
  let i = 0;
  iconSizes.forEach(iconSize => {
    let combo = document.getElementById('iconSelect' + iconSize);
    // When the app is opened for the first time there are no control values.
    let value = (combo === null) ? whiteIcons[i++] : combo.value;
      
    if (value !== "None") {
      manifest.icons.push({
        src: value,
        sizes: iconSize + "x" + iconSize,
          type: "image/png"
      });
    }
  });
  return manifest;
}

function findIconOfSize(size, manifest) {
  let needle = size + "x" + size;
  for (let icon of manifest.icons) {
  if (icon.src.includes(needle))
    return icon;      
  }
  return undefined;
}

function bulkUpdateIcons(iconType, manifest) {
  let i = 0;
  iconSizes.forEach(iconSize => {
    let combo = document.getElementById('iconSelect' + iconSize);
    switch (iconType) {
      case IconTypes.White: 
        combo.value = whiteIcons[i++];
        break;
      case IconTypes.Red: 
        combo.value = redIcons[i++];
        break;
      case IconTypes.Alternate: 
        combo.value = altIcons[i++];
        break;
    }
    combo.dispatchEvent(new Event('change'));
  })
}

function updateControls(manifest) {
  document.getElementById('appNameSelect').value = manifest.name;

  console.log(manifest.icons);
  let selectContainer = document.getElementById('selectBoxes');
  selectContainer.innerText = '';

  let i = 0;
  iconSizes.forEach(iconSize => {
    // Lookup what is set in the manifest for this size.
    let icon = findIconOfSize(iconSize, manifest);    

    // Create combo box for each size.
    let combo = document.createElement("select");
    combo.id = 'iconSelect' + iconSize;
    let option = document.createElement("option");
    option.value = whiteIcons[i];
    option.text = "White";
    combo.appendChild(option);
    
    option = document.createElement("option");
    option.value = redIcons[i];
    option.text = "Red";
    if (icon !== undefined && icon.src.includes("-red.png"))
      option.selected = true;
    combo.appendChild(option);

    option = document.createElement("option");
    option.value = altIcons[i];
    option.text = "Alt";
    if (icon !== undefined && icon.src.includes("-alt.png"))
      option.selected = true;
    combo.appendChild(option);

    option = document.createElement("option");
    option.text = "None";
    if (icon === undefined)
      option.selected = true;
    combo.appendChild(option);
    
    i += 1;
    
    selectContainer.appendChild(document.createTextNode(iconSize + " "));
    selectContainer.appendChild(combo);
    selectContainer.appendChild(document.createElement("br"));
  });
  
  let allRedButton = document.createElement("button");
  allRedButton.appendChild(document.createTextNode("All: Red"));
  allRedButton.onclick = function(e) { bulkUpdateIcons(IconTypes.Red, manifest) }
  let allWhiteButton = document.createElement("button");
  allWhiteButton.onclick = function(e) { bulkUpdateIcons(IconTypes.White, manifest) }
  allWhiteButton.appendChild(document.createTextNode("All: White"));
  let allAltButton = document.createElement("button");
  allAltButton.onclick = function(e) { bulkUpdateIcons(IconTypes.Alternate, manifest) }
  allAltButton.appendChild(document.createTextNode("All: Alternate"));

  selectContainer.appendChild(allRedButton);
  selectContainer.appendChild(allWhiteButton);
  selectContainer.appendChild(allAltButton);

  printLn("updateControls", "Controls updated.");
}

function updateDisplay(manifest) {
  document.getElementById('title').textContent = manifest.name;
  document.getElementById('appName').textContent = manifest.name;
  document.getElementById('favicon').href = manifest.icons[0].src;
  let imgContainer = document.getElementById('appIcons');
  imgContainer.innerText = '';

  let i = 0;
  let visible = 0;
  iconSizes.forEach(iconSize => {
    // Show each icon as bitmap (if set in manifest).
    let image = document.createElement("img");
    let icon = findIconOfSize(iconSize, manifest);
    console.log(iconSize, icon);
    if (icon !== undefined) {
      image.id = 'icon' + iconSize;
      image.src = icon.src;
      image.width = displaySize[i];
      image.classList.add('icon');
      //image.style.borderColor = manifest.theme_color;      
      imgContainer.appendChild(image);

      if (++visible % 3 == 0) imgContainer.appendChild(document.createElement('br'));
    }

    i++;
  });
  printLn("UpdateDisplay", "Display updated.");
}

function updateServiceWorker(manifest) {
  navigator.serviceWorker.ready.then((registration) => {
    console.log('ready ', registration, navigator.serviceWorker);
  });
  
  if (!navigator.serviceWorker.controller) {
    printLn("updateServiceWorker", "SW update failed.");
    console.log(navigator.serviceWorker);  
    return;
  }
  navigator.serviceWorker.controller.postMessage(manifest);
  printLn("updateServiceWorker", "SW updated.");
  console.log('Manifest:', manifest);
}

function updateLocalStorage(manifest) {
  localStorage.setItem("manifest", JSON.stringify(manifest));
  printLn("updateLocalStorage", "LS updated.");
}

function controlsChanged() {
  const manifest = readControlsManifest();
  updateServiceWorker(manifest);
  updateLocalStorage(manifest);
  updateDisplay(manifest);
}

main();
