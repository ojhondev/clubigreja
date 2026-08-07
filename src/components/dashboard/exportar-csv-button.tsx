"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui";

export interface LinhaExportavel {
  data: string;
  fiel: string;
  finalidade: string;
  meio: string;
  bruto: number;
  comissao: number;
  liquido: number;
}

function paraCsv(linhas: LinhaExportavel[]): string {
  const cabecalho = ["Data", "Fiel", "Finalidade", "Meio", "Bruto", "Comissão", "Líquido"];
  const corpo = linhas.map((l) =>
    [l.data, l.fiel, l.finalidade, l.meio, l.bruto.toFixed(2), l.comissao.toFixed(2), l.liquido.toFixed(2)]
      .map((campo) => `"${String(campo).replace(/"/g, '""')}"`)
      .join(";")
  );
  return ["﻿" + cabecalho.join(";"), ...corpo].join("\r\n");
}

export function ExportarCsvButton({ linhas, nomeArquivo }: { linhas: LinhaExportavel[]; nomeArquivo: string }) {
  function exportar() {
    const csv = paraCsv(linhas);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="secondary" onClick={exportar}>
      <span className="flex items-center gap-2">
        <Download size={16} />
        Exportar para planilha
      </span>
    </Button>
  );
}
