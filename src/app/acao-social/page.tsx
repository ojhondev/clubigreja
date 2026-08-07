import Link from "next/link";
import { HandHeart, ShoppingBag, Gift, Church } from "lucide-react";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui";
import { AcaoSocialSimulador } from "@/components/landing/acao-social-simulador";

export const metadata = {
  title: "Club Ação Social — Club Igreja",
  description:
    "Empresas parceiras da comunidade oferecem benefícios para fiéis cadastrados, e parte do valor volta para os projetos sociais da igreja.",
};

const PASSOS = [
  {
    icon: ShoppingBag,
    titulo: "O fiel compra com uma empresa parceira",
    descricao: "Comércios da própria comunidade — da padaria à farmácia — entram como parceiros do Club Ação Social.",
  },
  {
    icon: Gift,
    titulo: "Recebe um benefício automático",
    descricao: "Um desconto ou cashback é aplicado na hora, sem cupom, sem esforço — só por estar cadastrado no app.",
  },
  {
    icon: HandHeart,
    titulo: "Parte vira doação para o projeto social",
    descricao: "Uma fatia do benefício é redirecionada automaticamente para o projeto social da igreja do fiel.",
  },
];

const PUBLICOS = [
  {
    icon: Church,
    titulo: "Para a igreja",
    itens: [
      "Renda extra para projetos sociais sem pedir mais dízimo",
      "Nenhum trabalho operacional — o repasse é automático",
      "Fortalece o vínculo entre a igreja e o comércio da região",
    ],
  },
  {
    icon: HandHeart,
    titulo: "Para o fiel",
    itens: [
      "Desconto real nas compras do dia a dia",
      "Sabe exatamente para onde vai a parte social — para a própria igreja",
      "Não precisa fazer nada além de estar cadastrado no app",
    ],
  },
  {
    icon: ShoppingBag,
    titulo: "Para a empresa parceira",
    itens: [
      "Acesso a uma comunidade fiel e engajada",
      "Marketing de propósito — associada a uma causa social real",
      "Sem mensalidade para ser parceira, só o benefício combinado",
    ],
  },
];

export default function AcaoSocialPage() {
  return (
    <div className="flex min-h-full flex-col">
      <LandingNav />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pb-24 sm:pt-20">
          <span className="inline-block rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-bold text-foreground">
            Club Ação Social
          </span>
          <h1 className="font-display mx-auto mt-5 max-w-2xl text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Cada compra também ajuda a sua igreja.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
            Empresas parceiras da comunidade oferecem benefícios para fiéis cadastrados no Club
            Igreja — e uma parte de cada compra volta automaticamente para os projetos sociais da
            sua igreja.
          </p>
        </section>

        <section className="bg-[#F7FAFF] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                Como funciona
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {PASSOS.map((p, i) => (
                <div key={p.titulo} className="rounded-3xl border border-border bg-white p-8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF6FF] text-primary">
                    <p.icon size={26} />
                  </span>
                  <p className="font-display mt-4 text-xl font-bold text-foreground">{p.titulo}</p>
                  <p className="mt-2 text-muted">{p.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Simule o impacto de uma compra.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Exemplo de referência: numa compra de R$200, R$20 viram benefício — e R$5 disso vão
              direto para o projeto social da igreja.
            </p>
          </div>
          <AcaoSocialSimulador />
        </section>

        <section className="bg-primary py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                Bom para todo mundo.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {PUBLICOS.map((pub) => (
                <div key={pub.titulo} className="rounded-3xl bg-white p-8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF6FF] text-primary">
                    <pub.icon size={20} />
                  </span>
                  <p className="font-display mt-4 text-lg font-bold text-foreground">{pub.titulo}</p>
                  <ul className="mt-4 space-y-2">
                    {pub.itens.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="rounded-3xl bg-[#F7FAFF] px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Quer levar o Club Ação Social para sua igreja?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-lg text-muted">
              Cadastre sua igreja gratuitamente ou fale com nosso time — inclusive se sua empresa
              quiser ser uma parceira.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/cadastrar-igreja">
                <Button variant="dark" className="w-full font-display sm:w-auto">
                  Cadastre-se é grátis
                </Button>
              </Link>
              <a href="mailto:contato@dclubigreja.com">
                <Button variant="dark-outline" className="w-full font-display sm:w-auto">
                  Fale com nosso time
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
