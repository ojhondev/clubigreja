import { getFiel, registrarContribuicao, salvarCartaoFiel } from "../mock-db";
import type { CobrancaInput, CobrancaResultado, PaymentGateway } from "./gateway";

function tokenizarCartaoFake(numero: string) {
  const digitos = numero.replace(/\D/g, "");
  const ultimosDigitos = digitos.slice(-4) || "0000";
  const bandeira = digitos.startsWith("4") ? "Visa" : digitos.startsWith("5") ? "Mastercard" : "Cartão";
  return { bandeira, ultimosDigitos, tokenFake: `tok_fake_${Date.now()}` };
}

// Simula duas cobranças independentes, sem nenhuma chamada de rede: o Pix da
// doação (100% pra igreja) e a cobrança da taxa de processamento (pro Club
// Igreja) — nunca uma única cobrança dividida entre as duas contas.
export class MockPaymentGateway implements PaymentGateway {
  async criarCobranca(input: CobrancaInput): Promise<CobrancaResultado> {
    await simularLatenciaDeRede();

    if (input.novoCartao) {
      salvarCartaoFiel(input.fielId, tokenizarCartaoFake(input.novoCartao.numero));
    }

    const contribuicao = registrarContribuicao({
      fielId: input.fielId,
      igrejaId: input.igrejaId,
      tipo: input.tipo,
      campanhaId: input.campanhaId,
      valorBruto: input.valorBruto,
    });

    return {
      id: contribuicao.id,
      status: "CONFIRMADO",
      valorBruto: contribuicao.valorBruto,
      taxaValor: contribuicao.taxaValor,
      valorTotalFiel: contribuicao.valorTotalFiel,
      taxaCobradaVia: contribuicao.taxaCobradaVia,
      cartaoSalvo: getFiel(input.fielId)?.cartaoSalvo,
      criadaEm: contribuicao.criadaEm,
    };
  }
}

function simularLatenciaDeRede(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 400));
}
