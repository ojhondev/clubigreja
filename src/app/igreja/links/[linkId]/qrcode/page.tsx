import { notFound } from "next/navigation";
import { getIgreja, getLinkPagamento } from "@/lib/db/repo";
import { getSessao } from "@/lib/auth/session";
import { urlAbsoluta } from "@/lib/qrcode";
import { QrPoster } from "@/components/qr-poster";

const ROTULO_TIPO: Record<string, string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  campanha: "Campanha",
  evento: "Evento",
  livre: "Contribuição livre",
};

export default async function LinkQrCodePage({
  params,
}: {
  params: Promise<{ linkId: string }>;
}) {
  const { linkId } = await params;
  const sessao = await getSessao();
  // Escopado à própria igreja — mesmo achado C1 do QR code de campanha.
  const link = await getLinkPagamento(linkId, sessao!.igrejaId!);
  if (!link) notFound();

  const igreja = (await getIgreja(link.igrejaId))!;
  const url = await urlAbsoluta(`/doar/link/${link.id}`);

  return (
    <QrPoster
      voltarHref="/igreja/links"
      igrejaNome={igreja.nome}
      igrejaEmoji={igreja.logoEmoji}
      titulo={link.titulo}
      subtitulo={ROTULO_TIPO[link.tipo]}
      url={url}
    />
  );
}
