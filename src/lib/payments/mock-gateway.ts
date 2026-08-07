import { registrarContribuicao } from "../mock-db";
import type { CobrancaInput, CobrancaResultado, PaymentGateway } from "./gateway";

// Simula o comportamento de um gateway com split (formato Asaas): confirma o
// pagamento na hora, calcula a comissão do Club Igreja e "credita" o líquido
// na conta da igreja — tudo em memória, sem nenhuma chamada de rede.
export class MockPaymentGateway implements PaymentGateway {
  async criarCobranca(input: CobrancaInput): Promise<CobrancaResultado> {
    await simularLatenciaDeRede();

    const contribuicao = registrarContribuicao({
      fielId: input.fielId,
      igrejaId: input.igrejaId,
      tipo: input.tipo,
      campanhaId: input.campanhaId,
      meio: input.meio,
      valorBruto: input.valorBruto,
    });

    return {
      id: contribuicao.id,
      status: "CONFIRMADO",
      valorBruto: contribuicao.valorBruto,
      comissaoValor: contribuicao.comissaoValor,
      valorLiquido: contribuicao.valorLiquido,
      criadaEm: contribuicao.criadaEm,
    };
  }
}

function simularLatenciaDeRede(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 400));
}
