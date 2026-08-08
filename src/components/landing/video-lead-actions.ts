"use server";

import { registrarLeadVideo } from "@/lib/mock-db";

export async function registrarLeadVideoAction(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!nome || !whatsapp || !email) return;

  registrarLeadVideo({ nome, whatsapp, email });
}
