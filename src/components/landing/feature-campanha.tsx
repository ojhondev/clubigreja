import { MessageCircle, Mail } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { gerarQrCodeDataUrl } from "@/lib/qrcode";

export async function FeatureCampanha() {
  const qrDataUrl = await gerarQrCodeDataUrl(
    "https://dclubigreja.com/novavida",
  );

  return (
    <section
      id="como-funciona"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 flex justify-center lg:order-1">
          <Card className="relative flex flex-col items-center gap-4 px-10 py-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="QR Code de exemplo de uma campanha"
              className="h-48 w-48"
            />
            <p className="text-sm font-bold text-muted">
              dclubigreja.com/novavida
            </p>
            <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg">
              <MessageCircle size={20} />
            </div>
            <div className="absolute -bottom-4 -left-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary shadow-lg">
              <Mail size={20} />
            </div>
          </Card>
        </div>

        <div className="order-1 lg:order-2">
          <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Crie a campanha
            <br />e arrecade.
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted">
            De forma facilitada, o administrador da Igreja pode criar campanhas
            de arrecadação e publicar o link para a comunidade através do
            WhatsApp, QR Code ou por e-mail.
          </p>
          <a
            href="mailto:contato@dclubigreja.com"
            className="mt-6 inline-block"
          >
            <Button variant="dark-outline" className="font-display">
              Fale com nosso time
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
