// Gera um Pix Copia-e-Cola estático (EMV/BR Code) real, a partir da chave Pix
// que a própria igreja já tem no banco dela — sem nenhuma API externa. É
// exatamente o mesmo payload que qualquer banco gera hoje para uma cobrança
// Pix simples: a igreja nunca deixa de ser dona da própria chave.

function tlv(id: string, valor: string): string {
  const tamanho = valor.length.toString().padStart(2, "0");
  return `${id}${tamanho}${valor}`;
}

// CRC16-CCITT (polinômio 0x1021, início 0xFFFF) — exigido pelo padrão do
// Banco Central para o campo final do payload.
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function semAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function gerarPixCopiaECola(input: {
  chave: string;
  nomeRecebedor: string;
  cidade: string;
  valor: number;
  txId: string;
}): string {
  const nome = semAcentos(input.nomeRecebedor).toUpperCase().slice(0, 25) || "DIZIPAY";
  const cidade = semAcentos(input.cidade).toUpperCase().slice(0, 15) || "SAO PAULO";
  const txId = semAcentos(input.txId).replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "***";

  const contaPix = tlv("00", "BR.GOV.BCB.PIX") + tlv("01", input.chave);

  const payloadSemCrc =
    tlv("00", "01") +
    tlv("26", contaPix) +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", input.valor.toFixed(2)) +
    tlv("58", "BR") +
    tlv("59", nome) +
    tlv("60", cidade) +
    tlv("62", tlv("05", txId)) +
    "6304";

  return payloadSemCrc + crc16(payloadSemCrc);
}
