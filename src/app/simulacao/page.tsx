import type { Metadata } from "next";
import { SimulacaoPage } from "@/components/simulacao/simulacao-page";

export const metadata: Metadata = {
  title: "Explore a Plataforma — Dizipay",
  description:
    "Veja o dashboard do Dizipay, do jeito que a sua igreja vai usar todo dia.",
};

export default function Page() {
  return <SimulacaoPage />;
}
