function createElement(tag, attributes, textContent) {
  const element = document.createElement(tag);
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  element.textContent = textContent ?? '';
  return element;
}

let ready = JSON.parse(localStorage.getItem('ready') ?? 'false');

document.getElementById('status').textContent = ready ? 'Ready to install.' : 'Not ready to install. Refresh.';

document.head.appendChild(createElement('title', {}, ready ? 'Handsome Boom Mall' : 'Incorrect App Name'));
if (ready) {
  document.head.appendChild(createElement('link', {
    rel: 'manifest',
    href: 'manifest.webmanifest',
  }));
}

localStorage.setItem('ready', !ready);
