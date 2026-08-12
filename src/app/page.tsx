import { redirect } from "next/navigation";
import { getSessao } from "@/lib/auth/session";
import { LandingPage } from "@/components/landing/landing-page";

export default async function Home() {
  const sessao = await getSessao();

  if (sessao?.papel === "igreja") redirect("/igreja/dashboard");
  if (sessao?.papel === "fiel") redirect("/fiel/inicio");
  if (sessao?.papel === "webmaster") redirect("/admin/igrejas");

  return <LandingPage />;
}
