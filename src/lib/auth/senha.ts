import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const TAMANHO_HASH = 64;

// Hash de senha com scrypt (nativo do Node — sem dependência externa, sem
// custo). Formato salvo: "salt:hash", ambos em hex.
export async function hashSenha(senha: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivado = (await scryptAsync(senha, salt, TAMANHO_HASH)) as Buffer;
  return `${salt}:${derivado.toString("hex")}`;
}

export async function verificarSenha(
  senha: string,
  hashArmazenado: string,
): Promise<boolean> {
  const [salt, hashHex] = hashArmazenado.split(":");
  if (!salt || !hashHex) return false;

  const hashEsperado = Buffer.from(hashHex, "hex");
  const derivado = (await scryptAsync(senha, salt, TAMANHO_HASH)) as Buffer;

  // Comprimentos diferentes já indicam senha errada, mas ainda assim usamos
  // timingSafeEqual pra não vazar informação por tempo de resposta.
  if (derivado.length !== hashEsperado.length) return false;
  return timingSafeEqual(derivado, hashEsperado);
}
