self.addEventListener("push", (event) => {
  const dados = event.data ? event.data.json() : {};
  const titulo = dados.titulo || "Dizipay";
  const corpo = dados.corpo || "Você tem uma novidade no Dizipay.";

  event.waitUntil(
    self.registration.showNotification(titulo, {
      body: corpo,
      icon: "/dizipay-icon.png",
      badge: "/dizipay-icon.png",
      data: { url: dados.url || "/fiel/inicio" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/fiel/inicio";
  event.waitUntil(clients.openWindow(url));
});
