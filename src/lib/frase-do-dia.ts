import { hoje } from "./hoje";

export interface Versiculo {
  texto: string;
  referencia: string;
}

const VERSICULOS: Versiculo[] = [
  {
    texto: "O Senhor é o meu pastor; nada me faltará.",
    referencia: "Salmos 23:1",
  },
  {
    texto: "Tudo posso naquele que me fortalece.",
    referencia: "Filipenses 4:13",
  },
  {
    texto: "Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.",
    referencia: "Salmos 37:5",
  },
  {
    texto: "O amor é paciente, o amor é bondoso.",
    referencia: "1 Coríntios 13:4",
  },
  {
    texto:
      "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.",
    referencia: "Isaías 41:10",
  },
  {
    texto: "Alegrai-vos sempre no Senhor; outra vez digo, alegrai-vos.",
    referencia: "Filipenses 4:4",
  },
  {
    texto:
      "Cada um contribua segundo propôs no seu coração, não com tristeza ou por necessidade, porque Deus ama ao que dá com alegria.",
    referencia: "2 Coríntios 9:7",
  },
  {
    texto:
      "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.",
    referencia: "Mateus 11:28",
  },
  {
    texto: "O Senhor é a minha luz e a minha salvação; a quem temerei?",
    referencia: "Salmos 27:1",
  },
  {
    texto:
      "Tudo tem o seu tempo determinado, e há tempo para todo propósito debaixo do céu.",
    referencia: "Eclesiastes 3:1",
  },
  { texto: "Porque para Deus nada é impossível.", referencia: "Lucas 1:37" },
  {
    texto:
      "Buscai primeiro o Reino de Deus, e a sua justiça, e todas essas coisas vos serão acrescentadas.",
    referencia: "Mateus 6:33",
  },
  {
    texto: "O choro pode durar uma noite, mas a alegria vem pela manhã.",
    referencia: "Salmos 30:5",
  },
  {
    texto: "Amai-vos uns aos outros, como eu vos amei.",
    referencia: "João 13:34",
  },
  {
    texto:
      "Sede fortes e corajosos; não temais, nem vos atemorizeis, porque o Senhor teu Deus é contigo.",
    referencia: "Josué 1:9",
  },
];

function diaDoAno(data: Date): number {
  const inicio = new Date(data.getFullYear(), 0, 0);
  const diff = data.getTime() - inicio.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Muda uma vez por dia (mesma referência de "hoje" usada no resto do app) —
// não a cada recarregamento de página.
export function getFraseDoDia(): Versiculo {
  const indice = diaDoAno(hoje()) % VERSICULOS.length;
  return VERSICULOS[indice];
}
