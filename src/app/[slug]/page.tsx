import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArrecadadoCampanha,
  getCampanhasDaIgreja,
  getIgrejaPorSlug,
  getLinksDaIgreja,
} from "@/lib/mock-db";
import { formatarMoeda } from "@/lib/comissao";
import { Button, Card, ProgressBar } from "@/components/ui";
import { Logo } from "@/components/logo";

const ROTULO_TIPO: Record<string, string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  campanha: "Campanha",
  evento: "Evento",
  livre: "Valor livre",
};

export default async function IgrejaPublicaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const igreja = getIgrejaPorSlug(slug);
  if (!igreja || igreja.statusOnboarding !== "aprovado") notFound();

  const links = getLinksDaIgreja(igreja.id).filter((l) => l.ativo);
  const campanhas = getCampanhasDaIgreja(igreja.id).filter((c) => !c.encerrada);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-6 py-10">
      <div className="mb-2 flex justify-center">
        <Logo height={22} />
      </div>
      <div className="mb-8 text-center">
        <div className="mb-2 text-5xl">{igreja.logoEmoji}</div>
        <h1 className="text-xl font-bold">{igreja.nome}</h1>
        <p className="text-sm text-muted">
          {igreja.cidade}/{igreja.uf}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3">
        <Link href={`/${slug}/cadastro`}>
          <Button className="w-full">Sou fiel, cadastrar</Button>
        </Link>
        <Link href="/entrar/fiel">
          <Button variant="secondary" className="w-full">
            Já tenho conta
          </Button>
        </Link>
      </div>

      {links.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Contribuir agora</h2>
          <div className="space-y-3">
            {links.map((l) => (
              <Link key={l.id} href={`/doar/link/${l.id}`}>
                <Card className="flex items-center justify-between hover:border-primary">
                  <div>
                    <p className="font-bold">{l.titulo}</p>
                    <p className="text-sm text-muted">{ROTULO_TIPO[l.tipo]}</p>
                  </div>
                  <span className="text-primary">→</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {campanhas.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-bold">Campanhas em captação</h2>
          <div className="space-y-3">
            {campanhas.map((c) => {
              const arrecadado = getArrecadadoCampanha(c.id);
              const pct = (arrecadado / c.meta) * 100;
              return (
                <Link key={c.id} href={`/doar/campanha/${c.id}`}>
                  <Card className="hover:border-primary">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xl">{c.imagemEmoji}</span>
                      <p className="font-bold">{c.titulo}</p>
                    </div>
                    <ProgressBar percentual={pct} />
                    <p className="mt-2 text-sm text-muted">
                      {formatarMoeda(arrecadado)} de {formatarMoeda(c.meta)} ({pct.toFixed(0)}%)
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <p className="mt-10 text-center text-xs text-muted">
        Página oficial de {igreja.nome} no Dizipay — dclubigreja.com/{slug}
      </p>
    </div>
  );
}
