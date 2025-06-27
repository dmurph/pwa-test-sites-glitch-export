'use strict';


var cacheName= 'prefetch-cache-7';
var prefetchedURLs = [
    'index.html',
    'https://cdn.glitch.com/9bdcb1a9-d93f-4d1a-9d46-be446fbc251f%2Fblue-192.png'
];


self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return Promise.all(prefetchedURLs.map((url) => {
                return fetch(url).then(res => {
                    if(res.status >= 400) throw Error('request failed');
                    console.log('Cached ' + url);
                    return cache.put(url,res);
                })
            }))
        })
    )
});

function delay(t, v) {
   return new Promise(function(resolve) {
       setTimeout(resolve.bind(null, v), t);
   });
}

function interval(url) {
  return 0;
}



self.addEventListener('fetch', function(event) {
  event.respondWith(
    delay(interval(event.request.url)).then(function() {

            return caches.match(event.request).then(function(res) {
            if (res) {
                return res;
            }
      
      
            return fetch(event.request);
            });
    }));
});

