"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import { registrarLeadVideoAction } from "./video-lead-actions";

const CHAVE_LOCALSTORAGE = "club-igreja-video-visto";

export function VideoIntroModal() {
  const [visivel, setVisivel] = useState(false);
  const [terminou, setTerminou] = useState(false);
  const [podeFechar, setPodeFechar] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [mudo, setMudo] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ultimoTempoRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || localStorage.getItem(CHAVE_LOCALSTORAGE)) return;

    const timer = setTimeout(() => {
      localStorage.setItem(CHAVE_LOCALSTORAGE, "1");
      setVisivel(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // O X só pode fechar depois de 3s de vídeo rodando — não no primeiro frame.
  useEffect(() => {
    if (!visivel) return;
    const timerFechar = setTimeout(() => setPodeFechar(true), 3000);
    return () => clearTimeout(timerFechar);
  }, [visivel]);

  function impedirPausa() {
    const video = videoRef.current;
    if (video && !video.ended) video.play().catch(() => {});
  }

  function acompanharProgresso() {
    const video = videoRef.current;
    if (!video) return;
    const atual = video.currentTime;
    if (video.duration > 0) setProgresso(Math.min(100, (atual / video.duration) * 100));
    ultimoTempoRef.current = atual;
  }

  // Impede avanço manual: se o tempo pulou mais do que o esperado, volta.
  function impedirAvanco() {
    const video = videoRef.current;
    if (!video) return;
    if (Math.abs(video.currentTime - ultimoTempoRef.current) > 1.5) {
      video.currentTime = ultimoTempoRef.current;
    }
  }

  function alternarSom() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMudo(video.muted);
  }

  async function enviarFormulario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await registrarLeadVideoAction(formData);
    setEnviado(true);
  }

  if (!visivel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white lg:max-w-4xl">
        {podeFechar && (
          <button
            type="button"
            onClick={() => setVisivel(false)}
            aria-label="Fechar"
            className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X size={18} />
          </button>
        )}

        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            src="/video-intro.mp4"
            autoPlay
            muted={mudo}
            playsInline
            disablePictureInPicture
            controls={false}
            onPause={impedirPausa}
            onTimeUpdate={acompanharProgresso}
            onSeeking={impedirAvanco}
            onEnded={() => setTerminou(true)}
            onContextMenu={(e) => e.preventDefault()}
            className="h-full w-full bg-black object-contain"
          />
          {!terminou && <div className="absolute inset-0 z-10" />}
          <button
            type="button"
            onClick={alternarSom}
            aria-label={mudo ? "Ativar som" : "Silenciar"}
            className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            {mudo ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        <div className="h-1.5 w-full bg-border">
          <div className="h-full bg-primary transition-all" style={{ width: `${progresso}%` }} />
        </div>

        {terminou && !enviado && (
          <form onSubmit={enviarFormulario} className="space-y-3 p-6">
            <p className="font-bold text-foreground">Antes de continuar, deixe seu contato</p>
            <input
              name="nome"
              required
              placeholder="Nome"
              className="w-full rounded-xl border border-border px-4 py-3"
            />
            <input
              name="whatsapp"
              required
              placeholder="WhatsApp"
              className="w-full rounded-xl border border-border px-4 py-3"
            />
            <input
              name="email"
              required
              type="email"
              placeholder="E-mail"
              className="w-full rounded-xl border border-border px-4 py-3"
            />
            <button type="submit" className="w-full rounded-full bg-primary py-3 font-bold text-white">
              Enviar
            </button>
          </form>
        )}

        {terminou && enviado && (
          <div className="p-6 text-center">
            <p className="font-bold text-foreground">Obrigado! Já anotamos seu contato.</p>
          </div>
        )}
      </div>
    </div>
  );
}
