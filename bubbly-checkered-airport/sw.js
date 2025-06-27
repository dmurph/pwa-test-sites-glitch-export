self.addEventListener("install", function(e) {
  console.log("[ServiceWorker] Install");
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  console.log("[ServiceWorker] Activate");
  return self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  console.log("[Service Worker] Fetch", e.request.url);
  e.respondWith(fetch(e.request));
});

function displaySwNotification(useBadge) {
  var options = {
    body: "A notification body",
    icon:
      "https://cdn.glitch.com/9056b88b-8249-47fe-9d0c-0d9437c84482%2Ffugu-512.png?v=1571855943887",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  if (useBadge) {
    options.badge =
      "https://cdn.glitch.com/9056b88b-8249-47fe-9d0c-0d9437c84482%2Ffugu-128.png?v=1571855943920";
  }

  self.registration.showNotification("Text from service worker", options);
}

self.addEventListener("message", event => {
  if (event.data.type === "show_notification") {
    displaySwNotification(event.data.useBadge);
  }

  if (event.data.type === "close_all") {
    // close all notifications
    self.registration.getNotifications().then(function(notifications) {
      notifications.forEach(function(notification) {
        notification.close();
      });
    });
  }
});

self.addEventListener("notificationclick", function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === "close") {
    notification.close();
  } else {
    console.log("[ServiceWorker] Clicked notification: " + primaryKey);
    notification.close();
  }
});

self.addEventListener("notificationclose", function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  console.log("[ServiceWorker] Closed notification: " + primaryKey);
});
