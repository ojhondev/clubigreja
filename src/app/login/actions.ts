"use server";

import { redirect } from "next/navigation";
import { criarSessao } from "@/lib/auth/session";
import { fieis, usuariosIgreja } from "@/lib/mock-db";

export async function entrarComoIgreja(formData: FormData) {
  const usuarioId = String(formData.get("usuarioId"));
  const usuario = usuariosIgreja.find((u) => u.id === usuarioId);
  if (!usuario) return;

  await criarSessao({
    papel: "igreja",
    usuarioId: usuario.id,
    igrejaId: usuario.igrejaId,
    nome: usuario.nome,
  });
  redirect("/igreja/dashboard");
}

export async function entrarComoFiel(formData: FormData) {
  const fielId = String(formData.get("fielId"));
  const fiel = fieis.find((f) => f.id === fielId);
  if (!fiel) return;

  await criarSessao({
    papel: "fiel",
    usuarioId: fiel.id,
    igrejaId: fiel.igrejaId,
    nome: fiel.nome,
  });
  redirect("/fiel/inicio");
}

export async function entrarComoSuperadmin() {
  await criarSessao({
    papel: "superadmin",
    usuarioId: "superadmin-1",
    nome: "Equipe Club Igreja",
  });
  redirect("/admin/igrejas");
}
