import {kSuccess} from '/import.js';
console.log(kSuccess);

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(_ => {
    return new Response('Offline hickory.');
  }));
});
