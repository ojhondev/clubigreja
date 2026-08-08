import { gerarQrCodeDataUrl, urlAbsoluta } from "@/lib/qrcode";
import { LandingNav } from "./nav";
import { Hero } from "./hero";
import { EstimuloSection } from "./estimulo-section";
import { SobreOClub } from "./sobre-o-club";
import { ComoFunciona } from "./como-funciona";
import { FeatureCampanha } from "./feature-campanha";
import { FeatureReceber } from "./feature-receber";
import { Diferenciais } from "./diferenciais";
import { PorQueUsar } from "./por-que-usar";
import { Denominacoes } from "./denominacoes";
import { PricingSection } from "./pricing-section";
import { Faq } from "./faq";
import { CtaBand } from "./cta-band";
import { LandingFooter } from "./footer";
import { SimulacaoBar } from "./simulacao-bar";
import { VideoIntroModal } from "./video-intro-modal";

export async function LandingPage() {
  const url = await urlAbsoluta("/novavida/campanha/reforma-do-telhado");
  const qrDataUrl = await gerarQrCodeDataUrl(url);

  return (
    <div className="flex min-h-full flex-col">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <EstimuloSection />
        <SobreOClub />
        <ComoFunciona qrDataUrl={qrDataUrl} />
        <FeatureCampanha />
        <FeatureReceber />
        <Diferenciais />
        <PorQueUsar />
        <Denominacoes />
        <PricingSection />
        <Faq />
        <CtaBand />
      </main>
      <LandingFooter />
      <SimulacaoBar />
      <VideoIntroModal />
    </div>
  );
}
