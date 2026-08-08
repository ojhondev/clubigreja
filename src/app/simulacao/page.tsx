import type { Metadata } from "next";
import { SimulacaoPage } from "@/components/simulacao/simulacao-page";

export const metadata: Metadata = {
  title: "Explore a Plataforma — Club Igreja",
  description: "Veja o dashboard do Club Igreja, do jeito que a sua igreja vai usar todo dia.",
};

export default function Page() {
  return <SimulacaoPage />;
}
