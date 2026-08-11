import Link from "next/link";
import { Logo } from "@/components/logo";

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/">
        <Logo height={28} />
      </Link>
      <h1 className="mb-6 mt-8 text-3xl font-bold text-foreground">Termos de uso</h1>
      <div className="space-y-4 text-muted">
        <p>
          Este é um documento placeholder. Os termos de uso definitivos do Dizipay — cobrindo
          responsabilidades da plataforma, das igrejas e dos fiéis, a comissão sobre arrecadação e
          as condições de uso do split de pagamento — serão publicados aqui antes do lançamento em
          produção, após revisão jurídica.
        </p>
        <p>
          Em caso de dúvidas, entre em contato pelo e-mail{" "}
          <a href="mailto:contato@dclubigreja.com" className="font-bold text-primary">
            contato@dclubigreja.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
