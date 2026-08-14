import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { gerarQrCodeDataUrl } from "@/lib/qrcode";
import { Card } from "@/components/ui";
import { Logo } from "@/components/logo";
import { PrintButton } from "@/components/print-button";

export async function QrPoster({
  voltarHref,
  igrejaNome,
  igrejaEmoji,
  titulo,
  subtitulo,
  url,
}: {
  voltarHref: string;
  igrejaNome: string;
  igrejaEmoji: string;
  titulo: string;
  subtitulo: string;
  url: string;
}) {
  const qrDataUrl = await gerarQrCodeDataUrl(url);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={voltarHref}
          className="flex items-center gap-1 text-sm font-bold text-muted hover:text-primary"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={qrDataUrl}
            download={`qrcode-${titulo.toLowerCase().replace(/\s+/g, "-")}.png`}
          >
            <button className="w-full rounded-full border-2 border-primary px-4 py-2.5 text-sm font-bold text-primary hover:bg-[#EAF6FF] sm:w-auto sm:px-6 sm:py-3 sm:text-base">
              Baixar imagem
            </button>
          </a>
          <PrintButton />
        </div>
      </div>

      <Card className="mx-auto max-w-md text-center print:border-0 print:shadow-none">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-2xl">{igrejaEmoji}</span>
          <p className="font-bold">{igrejaNome}</p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={`QR Code — ${titulo}`}
          className="mx-auto mb-4 h-64 w-64"
        />

        <h1 className="text-xl font-bold">{titulo}</h1>
        <p className="mt-1 text-muted">{subtitulo}</p>
        <p className="mt-4 text-xs text-muted">
          Aponte a câmera do celular para contribuir
        </p>

        <div className="mt-6 border-t border-border pt-4">
          <Logo height={18} />
          <p className="mt-1 break-all text-xs text-muted">{url}</p>
        </div>
      </Card>
    </div>
  );
}
