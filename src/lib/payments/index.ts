import { MockPaymentGateway } from "./mock-gateway";
import type { PaymentGateway } from "./gateway";

// Único ponto de troca quando a integração real (Asaas) estiver pronta:
// export const gateway: PaymentGateway = new AsaasPaymentGateway();
export const gateway: PaymentGateway = new MockPaymentGateway();

export type { CobrancaInput, CobrancaResultado, PaymentGateway } from "./gateway";
