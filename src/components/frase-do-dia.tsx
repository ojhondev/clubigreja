import { BookOpen } from "lucide-react";
import { getFraseDoDia } from "@/lib/frase-do-dia";

export function FraseDoDia() {
  const versiculo = getFraseDoDia();

  return (
    <div className="rounded-2xl bg-primary px-5 py-4 text-white">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70">
        <BookOpen size={14} />
        Frase do dia
      </div>
      <p className="text-lg font-bold leading-snug">“{versiculo.texto}”</p>
      <p className="mt-2 text-sm text-white/70">{versiculo.referencia}</p>
    </div>
  );
}
