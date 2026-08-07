import type { Metadata } from "next";
import { gerarQrCodeDataUrl, urlAbsoluta } from "@/lib/qrcode";
import { SimulacaoPage } from "@/components/simulacao/simulacao-page";

export const metadata: Metadata = {
  title: "Simulação — Club Igreja",
  description: "Veja como a igreja lança uma campanha e como o fiel contribui, passo a passo.",
};

export default async function Page() {
  const url = await urlAbsoluta("/novavida/campanha/reforma-do-telhado");
  const qrDataUrl = await gerarQrCodeDataUrl(url);

  return <SimulacaoPage qrDataUrl={qrDataUrl} />;
}
