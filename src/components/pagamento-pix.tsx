import { notFound, redirect } from "next/navigation";
import { getCampanha, getContribuicao, getIgreja } from "@/lib/mock-db";
import { gerarPixCopiaECola } from "@/lib/pix";
import { gerarQrCodeDataUrl } from "@/lib/qrcode";
import { formatarMoeda } from "@/lib/comissao";
import { Button, Card } from "@/components/ui";
import { CopiarTexto } from "@/components/copiar-texto";

const ROTULO_TIPO: Record<string, string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  campanha: "Campanha",
  evento: "Evento",
  livre: "Contribuição livre",
};

// Tela central do fluxo real de doação: o fiel já escolheu o valor (etapa
// anterior), aqui ele efetivamente paga — via Pix, no app do banco dele — e
// só depois confirma. É essa confirmação, não a plataforma, que sabe que o
// dinheiro chegou; e é ela que libera a cobrança automática da taxa.
export async function PagamentoPix({
  contribuicaoId,
  confirmarAction,
  caminhoComprovanteBase,
}: {
  contribuicaoId: string;
  confirmarAction: (formData: FormData) => Promise<void>;
  caminhoComprovanteBase: string;
}) {
  const contribuicao = getContribuicao(contribuicaoId);
  if (!contribuicao) notFound();
  if (contribuicao.status === "confirmado") {
    redirect(`${caminhoComprovanteBase}/${contribuicaoId}`);
  }

  const igreja = getIgreja(contribuicao.igrejaId)!;
  const campanha = contribuicao.campanhaId ? getCampanha(contribuicao.campanhaId) : undefined;

  const copiaECola = gerarPixCopiaECola({
    chave: igreja.chavePix,
    nomeRecebedor: igreja.nome,
    cidade: igreja.cidade,
    valor: contribuicao.valorBruto,
    txId: contribuicao.id,
  });
  const qrDataUrl = await gerarQrCodeDataUrl(copiaECola);

  return (
    <div>
      <div className="mb-5 text-center">
        <p className="text-sm text-muted">
          {campanha ? campanha.titulo : ROTULO_TIPO[contribuicao.tipo]} · {igreja.nome}
        </p>
        <p className="mt-2 text-sm text-muted">Pague via Pix o valor abaixo</p>
        <p className="text-3xl font-bold text-foreground">{formatarMoeda(contribuicao.valorBruto)}</p>
      </div>

      <Card className="mb-4 flex flex-col items-center gap-4">
        <img src={qrDataUrl} alt="QR Code Pix" className="h-48 w-48 rounded-xl border border-border" />
        <p className="text-center text-xs text-muted">
          Escaneie com a câmera do app do seu banco, ou use o Pix Copia e Cola abaixo
        </p>
        <textarea
          readOnly
          value={copiaECola}
          rows={3}
          className="w-full resize-none rounded-xl border border-border bg-[#F7FAFF] px-3 py-2 font-mono text-xs text-muted"
        />
        <CopiarTexto texto={copiaECola} rotulo="Copiar código Pix" />
      </Card>

      <Card className="mb-5 bg-[#F7FAFF]">
        <p className="text-sm text-muted">
          Depois de pagar, toque em <strong>&quot;Já fiz o Pix&quot;</strong>. Vamos cobrar automaticamente a taxa
          de processamento ({formatarMoeda(contribuicao.taxaValor)}) no seu cartão salvo — sem pedir mais nada.
        </p>
      </Card>

      <form action={confirmarAction}>
        <input type="hidden" name="contribuicaoId" value={contribuicaoId} />
        <Button type="submit" className="w-full">
          Já fiz o Pix
        </Button>
      </form>
    </div>
  );
}
