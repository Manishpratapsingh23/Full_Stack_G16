self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  if (!event.data) {
    console.log('No data in push notification');
    return;
  }

  let notificationData;

  try {
    notificationData = event.data.json();
  } catch (error) {
    notificationData = {
      title: 'New Notification',
      body: event.data.text(),
    };
  }

  const options = {
    body: notificationData.body || notificationData.message || 'New notification',
    icon: '/book-icon.png',
    badge: '/book-badge.png',
    tag: notificationData.type || 'notification',
    requireInteraction: notificationData.type === 'due_date_reminder',
    data: {
      type: notificationData.type || 'general',
      url: notificationData.actionUrl || '/',
    },
    actions: [
      {
        action: 'open',
        title: 'View',
        icon: '/open-icon.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/close-icon.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag);

  event.notification.close();

  const urlToOpen = event.notification.data.url || '/';

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        if (clientList[i].url === urlToOpen && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification dismissed:', event.notification.tag);
});

self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
