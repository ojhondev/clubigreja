"use server";

import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";
import { criarSessao } from "@/lib/auth/session";

export interface EstadoLoginSuperadmin {
  erro?: string;
}

const SENHA_SUPERADMIN = process.env.SUPERADMIN_SENHA;

function senhaConfere(digitada: string): boolean {
  if (!SENHA_SUPERADMIN) return false;
  // Mesmo esquema de comparação em tempo constante do cookie de sessão —
  // evita vazar informação por tempo de resposta.
  const bufA = createHmac("sha256", "cmp").update(digitada).digest();
  const bufB = createHmac("sha256", "cmp").update(SENHA_SUPERADMIN).digest();
  return timingSafeEqual(bufA, bufB);
}

export async function entrarComoSuperadmin(
  _estadoAnterior: EstadoLoginSuperadmin,
  formData: FormData
): Promise<EstadoLoginSuperadmin> {
  const senha = String(formData.get("senha") ?? "");

  if (!senhaConfere(senha)) {
    return { erro: "Senha incorreta." };
  }

  await criarSessao({
    papel: "superadmin",
    usuarioId: "superadmin-1",
    nome: "Equipe Dizipay",
  });
  redirect("/admin/igrejas");
}
