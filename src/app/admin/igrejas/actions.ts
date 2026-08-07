"use server";

import { revalidatePath } from "next/cache";
import { atualizarStatusIgreja } from "@/lib/mock-db";

export async function aprovarIgrejaAction(formData: FormData) {
  const igrejaId = String(formData.get("igrejaId"));
  atualizarStatusIgreja(igrejaId, "aprovado");
  revalidatePath("/admin/igrejas");
}

export async function reprovarIgrejaAction(formData: FormData) {
  const igrejaId = String(formData.get("igrejaId"));
  atualizarStatusIgreja(igrejaId, "reprovado");
  revalidatePath("/admin/igrejas");
}
