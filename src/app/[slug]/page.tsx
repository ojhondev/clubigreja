import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import {
  getArrecadadoCampanha,
  getCampanhasDaIgreja,
  getIgrejaPorSlug,
  getLinksDaIgreja,
} from "@/lib/db/repo";
import { formatarMoeda } from "@/lib/comissao";
import { Badge, Button, Card, ProgressBar } from "@/components/ui";
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
  const igreja = await getIgrejaPorSlug(slug);
  if (!igreja || igreja.statusOnboarding !== "aprovado") notFound();

  const links = (await getLinksDaIgreja(igreja.id)).filter((l) => l.ativo);
  const campanhasAtivas = (await getCampanhasDaIgreja(igreja.id)).filter((c) => !c.encerrada);
  const campanhas = await Promise.all(
    campanhasAtivas.map(async (c) => ({ ...c, arrecadado: await getArrecadadoCampanha(c.id) }))
  );

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-6 py-10">
      <div className="mb-8 text-center">
        {igreja.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL arbitrária cadastrada pela igreja, domínio não é conhecido de antemão pro otimizador do Next.
          <img
            src={igreja.fotoUrl}
            alt={igreja.nome}
            width={80}
            height={80}
            className="mx-auto mb-3 h-20 w-20 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="mb-2 text-5xl">{igreja.logoEmoji}</div>
        )}
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
        <div className={links.length > 0 || igreja.linksExtras.length > 0 ? "mb-8" : undefined}>
          <h2 className="mb-3 text-lg font-bold">Campanhas em captação</h2>
          <div className="space-y-3">
            {campanhas.map((c, i) => {
              const arrecadado = c.arrecadado;
              const pct = (arrecadado / c.meta) * 100;
              return (
                <Link key={c.id} href={`/doar/campanha/${c.id}`}>
                  <Card className="hover:border-primary">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xl">{c.imagemEmoji}</span>
                      <p className="font-bold">{c.titulo}</p>
                      {i === 0 && <Badge tone="accent">Destaque</Badge>}
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

      {igreja.linksExtras.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-bold">Mais sobre a igreja</h2>
          <div className="space-y-3">
            {igreja.linksExtras.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
                <Card className="flex items-center justify-between hover:border-primary">
                  <p className="font-bold">{link.rotulo}</p>
                  <ExternalLink size={16} className="shrink-0 text-primary" />
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-2">
        <Logo height={16} />
        <p className="text-center text-xs text-muted">
          Página oficial de {igreja.nome} — dclubigreja.com/{slug}
        </p>
      </div>
    </div>
  );
}
