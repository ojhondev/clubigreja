import Link from "next/link";
import { Logo } from "@/components/logo";

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/">
        <Logo height={28} />
      </Link>
      <h1 className="mb-6 mt-8 text-3xl font-bold text-foreground">
        Política de privacidade
      </h1>
      <div className="space-y-4 text-muted">
        <p>
          Este é um documento placeholder. A política de privacidade definitiva
          — em conformidade com a LGPD, cobrindo quais dados de igrejas e fiéis
          coletamos, como usamos e por quanto tempo mantemos — será publicada
          aqui antes do lançamento em produção.
        </p>
        <p>
          Em caso de dúvidas, entre em contato pelo e-mail{" "}
          <a
            href="mailto:contato@dclubigreja.com"
            className="font-bold text-primary"
          >
            contato@dclubigreja.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
