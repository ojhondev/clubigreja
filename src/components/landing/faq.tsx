"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const PERGUNTAS = [
  {
    pergunta: "O dinheiro da minha igreja está seguro?",
    resposta:
      "Sim. O Dizipay nunca guarda nem movimenta o dinheiro da sua igreja — cada contribuição é um Pix direto pra chave Pix da própria igreja, sem passar pela nossa conta em nenhum momento. A igreja recebe 100% do que for arrecadado.",
  },
  {
    pergunta: "Isso é legal? Precisamos de alguma autorização?",
    resposta:
      "Sim, é legal. Sua igreja precisa apenas ter CNPJ para se cadastrar. Não existe mensalidade nem custo escondido — sua igreja recebe 100% do que for arrecadado, sempre.",
  },
  {
    pergunta: "Precisamos entender de tecnologia para usar?",
    resposta:
      "Não. O painel da igreja foi desenhado para ser simples como usar um aplicativo de banco — criar um link de pagamento leva menos de um minuto. E o fluxo do fiel é ainda mais simples: parecido com fazer um Pix comum.",
  },
  {
    pergunta: "Quanto tempo até o dinheiro cair na conta da igreja?",
    resposta:
      "Na hora. A contribuição é um Pix direto pra chave Pix da própria igreja — não existe prazo de repasse porque o Dizipay nunca chega a receber esse dinheiro.",
  },
  {
    pergunta: "Podemos cancelar a qualquer momento?",
    resposta:
      "Sim. Não existe fidelidade nem multa de cancelamento — e como não há mensalidade, não usar a plataforma não gera nenhum custo para a igreja.",
  },
  {
    pergunta: "Os dados dos nossos fiéis estão protegidos?",
    resposta:
      "Sim, seguimos a LGPD. Os dados de fiéis e da igreja nunca são vendidos ou compartilhados com terceiros — são usados só para operar a arrecadação da sua própria igreja.",
  },
  {
    pergunta: "Isso substitui o dízimo entregue em espécie durante o culto?",
    resposta:
      "Não, complementa. Quem preferir continuar contribuindo em espécie ou no envelope físico continua podendo — o Dizipay é um canal a mais, não uma obrigação.",
  },
  {
    pergunta: "E se tivermos alguma dúvida ou problema?",
    resposta:
      "Nosso time responde diretamente por e-mail ou WhatsApp — sem robô, sem fila. É só usar o botão \"Fale com nosso time\" em qualquer parte do site.",
  },
];

export function Faq() {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <section id="duvidas" className="bg-[#F7FAFF] py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <span className="text-sm font-bold text-primary">Tire suas dúvidas</span>
          <h2 className="font-display mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Perguntas que todo pastor e padre nos faz.
          </h2>
        </div>

        <div className="space-y-3">
          {PERGUNTAS.map((item, i) => {
            const estaAberta = aberta === i;
            return (
              <div key={item.pergunta} className="rounded-2xl border border-border bg-white">
                <button
                  type="button"
                  onClick={() => setAberta(estaAberta ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-bold text-foreground">{item.pergunta}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-muted transition-transform ${estaAberta ? "rotate-180" : ""}`}
                  />
                </button>
                {estaAberta && <p className="px-6 pb-5 text-muted">{item.resposta}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
