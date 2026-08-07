self.addEventListener("push", (event) => {
  const dados = event.data ? event.data.json() : {};
  const titulo = dados.titulo || "Club Igreja";
  const corpo = dados.corpo || "Você tem uma novidade no Club Igreja.";

  event.waitUntil(
    self.registration.showNotification(titulo, {
      body: corpo,
      icon: "/icon.png",
      badge: "/icon.png",
      data: { url: dados.url || "/fiel/inicio" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/fiel/inicio";
  event.waitUntil(clients.openWindow(url));
});
