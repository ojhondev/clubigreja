"use client";

import { Button } from "@/components/ui";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <Button
      variant="secondary"
      onClick={() => window.print()}
      className="w-full print:hidden sm:w-auto"
    >
      <Printer size={18} />
      Imprimir
    </Button>
  );
}
