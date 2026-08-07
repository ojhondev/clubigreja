import type { MeioPagamento, TipoArrecadacao } from "../types";

export interface CobrancaInput {
  igrejaId: string;
  fielId: string;
  tipo: TipoArrecadacao;
  campanhaId: string | null;
  meio: MeioPagamento;
  valorBruto: number;
}

export interface CobrancaResultado {
  id: string;
  status: "CONFIRMADO" | "PENDENTE" | "RECUSADO";
  valorBruto: number;
  comissaoValor: number;
  valorLiquido: number;
  criadaEm: string;
}

// Contrato que a integração real (Asaas) precisa satisfazer. A implementação
// mockada em mock-gateway.ts simula a resposta sem chamar nenhuma API externa —
// trocar para produção é substituir a implementação usada em index.ts, sem
// tocar nas telas que chamam `gateway.criarCobranca(...)`.
export interface PaymentGateway {
  criarCobranca(input: CobrancaInput): Promise<CobrancaResultado>;
}
