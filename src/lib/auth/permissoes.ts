import "server-only";
import { getOrigemWebmaster, getSessao } from "./session";
import { getWebmasterPorId } from "../db/repo";
import type { Webmaster } from "../types";

// Helpers de permissão compartilhados entre as actions do painel /admin e
// as actions que um webmaster pode disparar enquanto está "Acessar como"
// outra conta (ex.: editar o perfil de uma igreja impersonada).

export async function webmasterDaSessao(): Promise<Webmaster | null> {
  const sessao = await getSessao();
  if (sessao?.papel !== "webmaster") return null;
  return (await getWebmasterPorId(sessao.usuarioId)) ?? null;
}

// Quando o papel ativo é igreja/fiel só por causa de um "Acessar como", esse
// helper recupera o webmaster real por trás — usado pra aplicar restrições
// (ex.: pagamentos) mesmo durante o acesso impersonado.
export async function webmasterOrigemDaImpersonacao(): Promise<Webmaster | null> {
  const origem = await getOrigemWebmaster();
  if (!origem) return null;
  return (await getWebmasterPorId(origem.webmasterId)) ?? null;
}

export function podeAprovarIgrejas(webmaster: Webmaster): boolean {
  return webmaster.nivel === "primario" || webmaster.podeAprovarIgrejas;
}

export function podeGerenciarPagamentos(webmaster: Webmaster): boolean {
  return webmaster.nivel === "primario" || webmaster.podeGerenciarPagamentos;
}

// "Acessar como" (impersonação de igreja/fiel) dá visão total da conta
// impersonada — dashboard financeiro, histórico, dados pessoais. Restrito
// ao Master Primário por ora: não existe coluna de permissão própria pra
// isso ainda (achado H2/AUDIT.md), e reaproveitar podeAprovarIgrejas ou
// podeGerenciarPagamentos pra esse fim seria semanticamente errado — essas
// flags autorizam ações específicas, não "ver tudo de qualquer conta". Se o
// produto precisar que um Master Secundário impersone no futuro, isso pede
// uma flag própria (migration), não uma reinterpretação de flag existente.
export function podeImpersonar(webmaster: Webmaster): boolean {
  return webmaster.nivel === "primario";
}
