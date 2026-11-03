import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./overrides.css";
import { Footer } from "../components/Footer";
import { CookieNotice } from "../components/CookieNotice";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp";
import { Header } from "../components/Header";
import { siteConfig } from "../config/site";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sorianogrupo.com"),
  title: { default: "Soriano Grupo Inmobiliario | Cubelles", template: "%s | Soriano Grupo Inmobiliario" },
  description: siteConfig.description,
  icons: { icon: "/favicon/favicon-transparent.png", apple: "/favicon/favicon-transparent.png" },
  openGraph: { type: "website", locale: "es_ES", siteName: siteConfig.name, url: "/", title: "Soriano Grupo Inmobiliario", description: siteConfig.description, images: [{ url: "/logos/SORIANO_Grupo_Inmobiliario_logo_transparente.png", width: 3678, height: 834, alt: "Soriano Grupo Inmobiliario" }] },
  twitter: { card: "summary_large_image", title: "Soriano Grupo Inmobiliario", description: siteConfig.description, images: ["/logos/SORIANO_Grupo_Inmobiliario_logo_transparente.png"] },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: siteConfig.name,
  url: "https://www.sorianogrupo.com",
  logo: "https://www.sorianogrupo.com/logos/SORIANO_Grupo_Inmobiliario_logo_transparente.png",
  email: siteConfig.email,
  ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
  address: { "@type": "PostalAddress", streetAddress: siteConfig.address, addressLocality: "Cubelles", addressRegion: "Barcelona", addressCountry: "ES" },
  sameAs: [siteConfig.social.instagram, siteConfig.social.facebook].filter(Boolean),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body className={montserrat.variable}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} /><Header />{children}<Footer /><FloatingWhatsApp /><CookieNotice /></body></html>; }
