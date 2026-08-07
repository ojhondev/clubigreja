import Image from "next/image";

export function EstimuloSection() {
  return (
    <section className="bg-primary py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="font-display mx-auto max-w-2xl text-3xl font-bold leading-snug text-white sm:text-4xl">
          Criado para estimular doações.
          <br />
          Aumentar recorrência de ofertas.
        </p>

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-[2rem] shadow-2xl">
          <Image
            src="/hero-02.png"
            alt="Fazer doação — Paróquia N. Sra. Conceição"
            width={1522}
            height={763}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
