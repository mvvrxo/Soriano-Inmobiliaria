import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./overrides.css";
import { Footer } from "../components/Footer";
import { CookieNotice } from "../components/CookieNotice";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Header } from "../components/Header";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sorianogrupo.com"),
  title: { default: "Soriano Grupo Inmobiliario | Cubelles", template: "%s | Soriano Grupo Inmobiliario" },
  description: "Soriano Grupo Inmobiliario",
  icons: { icon: "/favicon/favicon-transparent.png", apple: "/favicon/favicon-transparent.png" },
  openGraph: { title: "Soriano Grupo Inmobiliario", description: "", images: [{ url: "/logos/SORIANO_Grupo_Inmobiliario_logo_transparente.png", width: 3678, height: 834, alt: "Soriano Grupo Inmobiliario" }] },
  twitter: { card: "summary_large_image", title: "Soriano Grupo Inmobiliario", description: "", images: ["/logos/SORIANO_Grupo_Inmobiliario_logo_transparente.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body className={montserrat.variable}><Header />{children}<Footer /><FloatingWhatsApp /><CookieNotice /></body></html>; }
