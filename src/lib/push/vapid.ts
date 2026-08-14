import "server-only";
import { generateKeyPairSync } from "node:crypto";

// Par de chaves VAPID gerado em memória a cada boot do servidor de dev — o
// suficiente para exercitar o fluxo real de inscrição em push do navegador.
// Em produção, gere um par fixo (`web-push generate-vapid-keys`) e leve as
// chaves via variável de ambiente, para que as inscrições sobrevivam a um redeploy.
let cache: {
  publicKeyBase64Url: string;
  publicKeyJwk: JsonWebKey;
  privateKeyJwk: JsonWebKey;
} | null = null;

export function getVapidKeys() {
  if (cache) return cache;

  const { publicKey, privateKey } = generateKeyPairSync("ec", {
    namedCurve: "prime256v1",
  });
  const publicKeyJwk = publicKey.export({ format: "jwk" }) as JsonWebKey;
  const privateKeyJwk = privateKey.export({ format: "jwk" }) as JsonWebKey;

  // applicationServerKey do Web Push é o ponto não comprimido (0x04 || x || y).
  const x = Buffer.from(publicKeyJwk.x!, "base64");
  const y = Buffer.from(publicKeyJwk.y!, "base64");
  const raw = Buffer.concat([Buffer.from([0x04]), x, y]);
  const publicKeyBase64Url = raw.toString("base64url");

  cache = { publicKeyBase64Url, publicKeyJwk, privateKeyJwk };
  return cache;
}
