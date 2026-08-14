import { notFound } from "next/navigation";
import { getCampanha, getIgreja } from "@/lib/db/repo";
import { urlAbsoluta } from "@/lib/qrcode";
import { QrPoster } from "@/components/qr-poster";

export default async function CampanhaQrCodePage({
  params,
}: {
  params: Promise<{ campanhaId: string }>;
}) {
  const { campanhaId } = await params;
  const campanha = await getCampanha(campanhaId);
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
