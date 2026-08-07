"use client";

import { useEffect, useState } from "react";

type Estado = "indisponivel" | "inativo" | "ativando" | "ativo" | "negado";

export function AtivarNotificacoes() {
  const [estado, setEstado] = useState<Estado>("inativo");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setEstado("indisponivel");
      return;
    }
    if (Notification.permission === "denied") setEstado("negado");
    if (Notification.permission === "granted") setEstado("ativo");
  }, []);

  async function ativar() {
    setEstado("ativando");
    try {
      const registro = await navigator.serviceWorker.register("/sw.js");
      const permissao = await Notification.requestPermission();
      if (permissao !== "granted") {
        setEstado(permissao === "denied" ? "negado" : "inativo");
        return;
      }

      const { publicKey } = await fetch("/api/push/vapid-public-key").then((r) => r.json());
      const subscription = await registro.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setEstado("ativo");
    } catch {
      setEstado("inativo");
    }
  }

  if (estado === "indisponivel" || estado === "ativo") return null;

  return (
    <button
      onClick={ativar}
      disabled={estado === "ativando" || estado === "negado"}
      className="w-full rounded-xl border border-dashed border-border px-4 py-3 text-left text-sm text-muted hover:border-primary hover:text-primary disabled:opacity-60"
    >
      {estado === "negado"
        ? "Notificações bloqueadas no navegador — ative nas configurações do site."
        : estado === "ativando"
          ? "Ativando notificações…"
          : "🔔 Ativar lembrete de dízimo por notificação"}
    </button>
  );
}

function urlBase64ToUint8Array(base64Url: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}
