import "server-only";
import QRCode from "qrcode";
import { headers } from "next/headers";

export async function gerarQrCodeDataUrl(texto: string): Promise<string> {
  return QRCode.toDataURL(texto, {
    width: 480,
    margin: 1,
    color: { dark: "#002991", light: "#ffffff" },
  });
}

// Deriva o domínio da própria requisição — funciona tanto em localhost
// quanto em qualquer domínio de preview/produção da Vercel, sem precisar
// hardcodar nada. Quando o domínio final (dclubigreja.com) entrar, isso
// continua funcionando sem alteração.
export async function urlAbsoluta(caminho: string): Promise<string> {
  const cabecalhos = await headers();
  const host = cabecalhos.get("host") ?? "club-igreja.vercel.app";
  const protocolo = host.startsWith("localhost") ? "http" : "https";
  return `${protocolo}://${host}${caminho}`;
}
