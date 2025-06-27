const origin = self.registration.scope;

let id = 0;
let redirect = true;

console.log("run");

self.addEventListener("message", (event) => {
  console.log("Setting redirect to " + event.data.redirect)
  redirect = event.data.redirect;
});

self.addEventListener("fetch", (event) => {
  let url = new URL(event.request.url);
  if (event.request.method == "GET" && url.pathname.startsWith("/app/")) {
    if (redirect) {
      event.respondWith(Response.redirect("/redirection_location/index.html"));
    } else {
      return fetch(event.request).then((response) => {
        const newHeaders = new Headers(response.headers);
        newHeaders.append("Cache-Control", "no-cache, must-revalidate");

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      });
    }
  } else {
    event.respondWith(
      fetch(event.request).catch((_) => {
        return new Response("Offline test.");
      })
    );
  }
});
