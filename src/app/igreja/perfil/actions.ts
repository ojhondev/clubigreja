"use server";

import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import { adicionarLinkExtra, atualizarPerfilIgreja, removerLinkExtra } from "@/lib/db/repo";

export interface EstadoPerfilIgreja {
  erro?: string;
  sucesso?: boolean;
}

export async function atualizarPerfilAction(
  _estadoAnterior: EstadoPerfilIgreja,
  formData: FormData
): Promise<EstadoPerfilIgreja> {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return { erro: "Sessão expirada." };

  const nome = String(formData.get("nome") ?? "").trim();
  const cnpj = String(formData.get("cnpj") ?? "").trim();
  const responsavelNome = String(formData.get("responsavelNome") ?? "").trim();
  const responsavelEmail = String(formData.get("responsavelEmail") ?? "").trim();
  const responsavelWhatsapp = String(formData.get("responsavelWhatsapp") ?? "").trim();
  const cidade = String(formData.get("cidade") ?? "").trim();
  const uf = String(formData.get("uf") ?? "").trim().toUpperCase();
  const chavePix = String(formData.get("chavePix") ?? "").trim();
  const fotoUrl = String(formData.get("fotoUrl") ?? "").trim();

  if (!nome || !responsavelNome || !responsavelEmail || !responsavelWhatsapp || !cidade || !uf || !chavePix) {
    return { erro: "Preencha todos os campos obrigatórios." };
  }

  const igreja = await atualizarPerfilIgreja(sessao.igrejaId, {
    nome,
    cnpj,
    responsavelNome,
    responsavelEmail,
    responsavelWhatsapp,
    cidade,
    uf,
    chavePix,
    fotoUrl: fotoUrl || undefined,
  });

  revalidatePath("/igreja/perfil");
  if (igreja) revalidatePath(`/${igreja.slug}`);
  return { sucesso: true };
}

export async function adicionarLinkExtraAction(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const rotulo = String(formData.get("rotulo") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!rotulo || !url) return;

  await adicionarLinkExtra(sessao.igrejaId, { rotulo, url });
  revalidatePath("/igreja/perfil");
}

export async function removerLinkExtraAction(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const linkExtraId = String(formData.get("linkExtraId") ?? "");
  if (!linkExtraId) return;

  await removerLinkExtra(sessao.igrejaId, linkExtraId);
  revalidatePath("/igreja/perfil");
}
