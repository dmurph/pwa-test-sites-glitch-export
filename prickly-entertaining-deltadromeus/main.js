navigator.serviceWorker.register('serviceworker.js');

const urls = [
  'https://prickly-entertaining-deltadromeus.glitch.me/',
  'https://octagonal-handsomely-burrito.glitch.me/',
  'https://www.example.com/',
  'about:blank',
];

const iframe = document.createElement("iframe");
// iframe.src = urls[0];
iframe.name = "iframe"
document.body.appendChild(iframe);

for (const url of urls) {
  const heading = document.createElement('h3');
  heading.textContent = url;
  document.body.appendChild(heading);

  const list = document.createElement('ul');
  document.body.appendChild(list);
  
  function addItem(item) {
    const li = document.createElement('li');
    li.appendChild(item);
    list.appendChild(li);
  }
  
  for (const target of ['_self', 'iframe', '_blank', 'frameName']) {
    const link = document.createElement('a');
    link.textContent = `target="${target}" rel=opener`;
    link.href = url;
    link.target = target;
    link.rel = "opener";
    addItem(link);
    
    const link2 = document.createElement('a');
    link2.textContent = `target="${target}" rel=noopener`;
    link2.href = url;
    link2.target = target;
    link2.rel = "noopener";
    addItem(link2);
    
    const button = document.createElement('button');
    button.textContent = 'window.open(url, '+target+', opener)';
    button.onclick = () => {
      window.open(url, target);
    }
    // Rough way of handling middle clicks.
    button.onauxclick = () => {
      window.open(url, target);
    }
    addItem(button);
  
    const button2 = document.createElement('button');
    button2.textContent = 'window.open(url, '+target+', noopener)';
    button2.onclick = () => {
      window.open(url, target, 'noopener');
    }
    // Rough way of handling middle clicks.
    button2.onauxclick = () => {
      window.open(url, target, 'noopener');
    }
    addItem(button2);
    }
}