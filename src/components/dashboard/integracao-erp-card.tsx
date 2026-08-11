import { Plug } from "lucide-react";
import { Card, Button } from "@/components/ui";

export function IntegracaoErpCard() {
  return (
    <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Plug size={20} />
        </span>
        <div>
          <p className="font-bold text-foreground">Integração com ERP ou sistema contábil</p>
          <p className="text-sm text-muted">
            Conecte a arrecadação da igreja ao seu sistema de gestão financeira. Nossa equipe cuida da configuração.
          </p>
        </div>
      </div>
      <a href="mailto:contato@dclubigreja.com?subject=Integração%20com%20ERP" className="shrink-0">
        <Button variant="secondary">Falar com o time do Dizipay</Button>
      </a>
    </Card>
  );
}
