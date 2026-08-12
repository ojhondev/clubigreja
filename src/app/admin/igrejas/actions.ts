"use server";

import { revalidatePath } from "next/cache";
import { atualizarStatusIgreja } from "@/lib/db/repo";

export async function aprovarIgrejaAction(formData: FormData) {
  const igrejaId = String(formData.get("igrejaId"));
  await atualizarStatusIgreja(igrejaId, "aprovado");
  revalidatePath("/admin/igrejas");
}

export async function reprovarIgrejaAction(formData: FormData) {
  const igrejaId = String(formData.get("igrejaId"));
  await atualizarStatusIgreja(igrejaId, "reprovado");
  revalidatePath("/admin/igrejas");
}
