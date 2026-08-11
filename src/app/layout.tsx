import type { Metadata, Viewport } from "next";
import { Ubuntu, Baloo_2 } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Fonte de destaque usada só na landing page (títulos/botões), aproximando o
// visual arredondado do material de referência — o app/dashboard continua em Ubuntu.
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Dizipay",
  description: "Dízimo, ofertas e campanhas da sua igreja em um só lugar.",
  manifest: "/manifest.json",
  icons: {
    icon: "/dizipay-icon.png",
    shortcut: "/dizipay-icon.png",
    apple: "/dizipay-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dizipay",
  },
};

export const viewport: Viewport = {
  themeColor: "#002991",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${ubuntu.variable} ${baloo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
