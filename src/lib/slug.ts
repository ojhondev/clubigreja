const MARCAS_DIACRITICAS = new RegExp("[\\u0300-\\u036f]", "g");

export function slugify(texto: string): string {
  return (
    texto
      .normalize("NFD")
      .replace(MARCAS_DIACRITICAS, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "igreja"
  );
}
