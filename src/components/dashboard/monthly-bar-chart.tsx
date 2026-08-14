"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { TotalMensalDetalhado } from "@/lib/relatorios";
import { formatarMoeda } from "@/lib/comissao";

export function MonthlyBarChart({ dados }: { dados: TotalMensalDetalhado[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={dados}
        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
      >
        <CartesianGrid vertical={false} stroke="#e7eaf3" />
        <XAxis
          dataKey="rotulo"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#6b7488" }}
          tickFormatter={(v: string) => v.charAt(0).toUpperCase() + v.slice(1)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "#6b7488" }}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
          }
        />
        <Tooltip
          cursor={{ fill: "rgba(0,41,145,0.05)" }}
          formatter={(value) => formatarMoeda(Number(value))}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #e7eaf3",
            fontSize: 13,
          }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar
          dataKey="Dízimo"
          stackId="a"
          fill="#002991"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="Campanha"
          stackId="a"
          fill="#60cdff"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="Outros"
          stackId="a"
          fill="#c7cfe0"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
