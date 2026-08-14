"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatarMoeda } from "@/lib/comissao";

const CORES: Record<string, string> = {
  Dízimo: "#002991",
  Oferta: "#60cdff",
  Campanha: "#12875a",
  Evento: "#f0a83c",
  Livre: "#c7cfe0",
};

export function FinalidadePieChart({
  dados,
}: {
  dados: { nome: string; valor: number }[];
}) {
  const comValor = dados.filter((d) => d.valor > 0);

  if (comValor.length === 0) {
    return (
      <p className="flex h-[220px] items-center justify-center text-sm text-muted">
        Sem dados ainda.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={comValor}
          dataKey="valor"
          nameKey="nome"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
        >
          {comValor.map((d) => (
            <Cell key={d.nome} fill={CORES[d.nome] ?? "#c7cfe0"} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatarMoeda(Number(value))}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #e7eaf3",
            fontSize: 13,
          }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
