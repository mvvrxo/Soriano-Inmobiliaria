import type { Metadata } from "next";
import "./globals.css";
import "./overrides.css";
import { Footer } from "../components/Footer";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Header } from "../components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sorianogrupo.com"),
  title: { default: "Soriano Grupo Inmobiliario | Cubelles", template: "%s | Soriano Grupo Inmobiliario" },
  description: "Inmobiliaria en Cubelles para propietarios que quieren vender y clientes que buscan vivienda.",
  openGraph: { title: "Soriano Grupo Inmobiliario | Cubelles", description: "Inmobiliaria en Cubelles para propietarios y compradores.", images: [{ url: "/og.png", width: 1728, height: 920, alt: "Soriano Grupo Inmobiliario" }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body><Header />{children}<Footer /><FloatingWhatsApp /></body></html>; }
