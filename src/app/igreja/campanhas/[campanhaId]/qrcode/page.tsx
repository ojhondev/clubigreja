import { notFound } from "next/navigation";
import { getCampanha, getIgreja } from "@/lib/db/repo";
import { getSessao } from "@/lib/auth/session";
import { urlAbsoluta } from "@/lib/qrcode";
import { QrPoster } from "@/components/qr-poster";

export default async function CampanhaQrCodePage({
  params,
}: {
  params: Promise<{ campanhaId: string }>;
}) {
  const { campanhaId } = await params;
  const sessao = await getSessao();
  // Escopado à própria igreja — sem isso, trocar o id na URL mostraria a
  // campanha de outra igreja (achado C1 da auditoria).
  const campanha = await getCampanha(campanhaId, sessao!.igrejaId!);
  if (!campanha) notFound();

  const igreja = (await getIgreja(campanha.igrejaId))!;
  const url = await urlAbsoluta(`/doar/campanha/${campanha.id}`);

  return (
    <QrPoster
      voltarHref="/igreja/campanhas"
      igrejaNome={igreja.nome}
      igrejaEmoji={igreja.logoEmoji}
      titulo={`${campanha.imagemEmoji} ${campanha.titulo}`}
      subtitulo="Campanha de captação"
      url={url}
    />
  );
}
