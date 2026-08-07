# Club Igreja

SaaS para igrejas arrecadarem dízimo, ofertas e campanhas via Pix, cartão e boleto — com uma comissão automática via split de pagamento, em uma experiência simples e direta (inspirada no PayPal), pensada para um público que nem sempre é familiarizado com tecnologia.

🔗 [dclubigreja.com](https://club-igreja.vercel.app) (ambiente de demonstração)

## Stack

- **Next.js 16** (App Router, Turbopack, Server Actions)
- **TypeScript**
- **Tailwind CSS v4**
- **Recharts** (gráficos do dashboard)
- **Framer Motion** (animações da página de simulação)

## Estado do projeto

A empresa ainda não está formalmente aberta, então **todos os dados e integrações são mockados**: autenticação por cookie sem senha real, gateway de pagamento simulado (no formato da API do Asaas) e banco de dados em memória (reinicia a cada deploy/cold start). O ambiente foi construído como se fosse produção, pronto para trocar os mocks pelas integrações reais quando a empresa estiver formalizada.

## Principais módulos

- **Painel da Igreja** — dashboard com gráficos reais, campanhas, links de pagamento, eventos, mural, relatórios com exportação CSV.
- **App do Fiel** — mural da igreja, campanhas em captação, histórico de contribuições, lembrete de dízimo recorrente.
- **Onboarding** — cadastro de igreja com aprovação, cadastro de fiel, login por slug de igreja, QR Code para links e campanhas.
- **Landing page** — página institucional com simulador de comissão e página de simulação interativa do fluxo do produto (`/simulacao`).
- **Club Ação Social** — benefícios de empresas parceiras revertidos em parte para projetos sociais da igreja.
- **Acesso master** (`/login`) — hub de desenvolvimento para testar todos os perfis de usuário sem depender do login real.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Build de produção

```bash
npm run build
npm start
```
