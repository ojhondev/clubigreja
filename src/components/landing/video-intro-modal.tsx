"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import { registrarLeadVideoAction } from "./video-lead-actions";

// Placeholder — troca pelo vídeo real assim que o cliente enviar.
const VIDEO_ID = "YE7VzlLtp-4";
const CHAVE_LOCALSTORAGE = "club-igreja-video-visto";
const SRC_IFRAME_API = "https://www.youtube.com/iframe_api";

interface YouTubePlayer {
  playVideo: () => void;
  mute: () => void;
  unMute: () => void;
  seekTo: (segundos: number, permitir: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (elemento: HTMLElement, options: Record<string, unknown>) => YouTubePlayer;
      PlayerState: { PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export function VideoIntroModal() {
  const [visivel, setVisivel] = useState(false);
  const [terminou, setTerminou] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [mudo, setMudo] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const ultimoTempoRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || localStorage.getItem(CHAVE_LOCALSTORAGE)) return;

    const timer = setTimeout(() => {
      localStorage.setItem(CHAVE_LOCALSTORAGE, "1");
      setVisivel(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Cria um elemento próprio a cada execução do efeito (em vez de reaproveitar um id
  // fixo) — o React 19/StrictMode roda o efeito duas vezes em dev, e o YouTube troca
  // o elemento por um iframe, então reaproveitar o mesmo id quebra na segunda vez.
  useEffect(() => {
    if (!visivel || !wrapperRef.current) return;

    let destruido = false;
    let intervalo: ReturnType<typeof setInterval> | undefined;
    let player: YouTubePlayer | null = null;

    const elementoPlayer = document.createElement("div");
    wrapperRef.current.appendChild(elementoPlayer);

    function criarPlayer() {
      if (destruido) return;
      player = new window.YT.Player(elementoPlayer, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
        },
        events: {
          onReady: (evento: { target: YouTubePlayer }) => {
            if (destruido) return;
            playerRef.current = evento.target;
            intervalo = setInterval(() => {
              const atual = evento.target.getCurrentTime();
              const duracao = evento.target.getDuration();
              if (duracao > 0) setProgresso(Math.min(100, (atual / duracao) * 100));

              // Impede avanço manual: se o tempo pulou mais do que o esperado, volta.
              if (atual - ultimoTempoRef.current > 2) {
                evento.target.seekTo(ultimoTempoRef.current, true);
              } else {
                ultimoTempoRef.current = atual;
              }
            }, 500);
          },
          onStateChange: (evento: { data: number; target: YouTubePlayer }) => {
            if (evento.data === window.YT.PlayerState.PAUSED) evento.target.playVideo();
            if (evento.data === window.YT.PlayerState.ENDED) setTerminou(true);
          },
        },
      });
    }

    if (window.YT?.Player) {
      criarPlayer();
    } else {
      if (!document.querySelector(`script[src="${SRC_IFRAME_API}"]`)) {
        const script = document.createElement("script");
        script.src = SRC_IFRAME_API;
        document.body.appendChild(script);
      }
      window.onYouTubeIframeAPIReady = criarPlayer;
    }

    return () => {
      destruido = true;
      if (intervalo) clearInterval(intervalo);
      player?.destroy?.();
      playerRef.current = null;
    };
  }, [visivel]);

  function alternarSom() {
    const player = playerRef.current;
    if (!player) return;
    if (mudo) player.unMute();
    else player.mute();
    setMudo(!mudo);
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
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white">
        {terminou && (
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
          <div ref={wrapperRef} className="h-full w-full" />
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
