import { LandingNav } from "./nav";
import { Hero } from "./hero";
import { EstimuloSection } from "./estimulo-section";
import { Pilares } from "./pilares";
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

export function LandingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <EstimuloSection />
        <Pilares />
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
    </div>
  );
}
