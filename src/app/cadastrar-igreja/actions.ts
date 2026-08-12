"use server";

import { redirect } from "next/navigation";
import { criarIgreja, criarUsuarioIgreja } from "@/lib/db/repo";
import { criarSessao } from "@/lib/auth/session";

export interface EstadoCadastroIgreja {
  erro?: string;
}

export async function cadastrarIgrejaAction(
  _estadoAnterior: EstadoCadastroIgreja,
  formData: FormData
): Promise<EstadoCadastroIgreja> {
  const nome = String(formData.get("nome") ?? "").trim();
  const cnpj = String(formData.get("cnpj") ?? "").trim();
  const responsavelNome = String(formData.get("responsavelNome") ?? "").trim();
  const responsavelEmail = String(formData.get("responsavelEmail") ?? "").trim();
  const responsavelWhatsapp = String(formData.get("responsavelWhatsapp") ?? "").trim();
  const cidade = String(formData.get("cidade") ?? "").trim();
  const uf = String(formData.get("uf") ?? "").trim().toUpperCase();
  const chavePix = String(formData.get("chavePix") ?? "").trim();

  if (!nome || !responsavelNome || !responsavelEmail || !responsavelWhatsapp || !cidade || !uf || !chavePix) {
    return { erro: "Preencha todos os campos obrigatórios." };
  }

  const cnpjDigitos = cnpj.replace(/\D/g, "");
  if (cnpjDigitos.length !== 14) {
    return { erro: "Informe um CNPJ válido (14 dígitos) — é obrigatório para operar na plataforma." };
  }

  const igreja = await criarIgreja({
    nome,
    cnpj,
    responsavelNome,
    responsavelEmail,
    responsavelWhatsapp,
    cidade,
    uf,
    chavePix,
  });
  const usuario = await criarUsuarioIgreja({
    igrejaId: igreja.id,
    nome: responsavelNome,
    email: responsavelEmail,
    papel: "administrador",
  });

  await criarSessao({
    papel: "igreja",
    usuarioId: usuario.id,
    igrejaId: igreja.id,
    nome: usuario.nome,
  });

  redirect("/igreja/dashboard");
}
