addEventListener('fetch', event => {
  event.respondWith((async () => {
    try {
      return await fetch(event.request);
    } catch {
      return new Response('Offline day.');
    }
  })());
});