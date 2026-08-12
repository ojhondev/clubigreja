import { confirmarContribuicao, getFiel, getIgreja, iniciarContribuicao, salvarCartaoFiel } from "../db/repo";
import { gerarPixCopiaECola } from "../pix";
import type { ConfirmacaoPagamento, DadosParaPagamento, IniciarContribuicaoInput, PaymentGateway } from "./gateway";

function tokenizarCartaoFake(numero: string) {
  const digitos = numero.replace(/\D/g, "");
  const ultimosDigitos = digitos.slice(-4) || "0000";
  const bandeira = digitos.startsWith("4") ? "Visa" : digitos.startsWith("5") ? "Mastercard" : "Cartão";
  return { bandeira, ultimosDigitos, tokenFake: `tok_fake_${Date.now()}` };
}

// Simula o fluxo real em duas chamadas independentes, sem nenhum acesso de
// rede: iniciarContribuicao só registra a intenção e gera o Pix; a cobrança
// da taxa só acontece em confirmarPagamento, quando o fiel volta e confirma
// que já pagou — nunca uma única cobrança dividida entre as duas contas.
export class MockPaymentGateway implements PaymentGateway {
  async iniciarContribuicao(input: IniciarContribuicaoInput): Promise<DadosParaPagamento> {
    await simularLatenciaDeRede();

    if (input.novoCartao) {
      await salvarCartaoFiel(input.fielId, tokenizarCartaoFake(input.novoCartao.numero));
    }

    const igreja = (await getIgreja(input.igrejaId))!;
    const contribuicao = await iniciarContribuicao({
      fielId: input.fielId,
      igrejaId: input.igrejaId,
      tipo: input.tipo,
      campanhaId: input.campanhaId,
      valorBruto: input.valorBruto,
    });

    const copiaECola = gerarPixCopiaECola({
      chave: igreja.chavePix,
      nomeRecebedor: igreja.nome,
      cidade: igreja.cidade,
      valor: contribuicao.valorBruto,
      txId: contribuicao.id,
    });

    return {
      contribuicaoId: contribuicao.id,
      chavePix: igreja.chavePix,
      nomeIgreja: igreja.nome,
      valorBruto: contribuicao.valorBruto,
      taxaValor: contribuicao.taxaValor,
      valorTotalFiel: contribuicao.valorTotalFiel,
      copiaECola,
    };
  }

  async confirmarPagamento(contribuicaoId: string): Promise<ConfirmacaoPagamento> {
    await simularLatenciaDeRede();

    const contribuicao = await confirmarContribuicao(contribuicaoId);
    if (!contribuicao) throw new Error("Contribuição não encontrada");

    return {
      id: contribuicao.id,
      status: "CONFIRMADO",
      valorBruto: contribuicao.valorBruto,
      taxaValor: contribuicao.taxaValor,
      valorTotalFiel: contribuicao.valorTotalFiel,
      taxaCobradaVia: contribuicao.taxaCobradaVia,
      cartaoSalvo: (await getFiel(contribuicao.fielId))?.cartaoSalvo,
      criadaEm: contribuicao.criadaEm,
    };
  }
}

function simularLatenciaDeRede(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 400));
}
