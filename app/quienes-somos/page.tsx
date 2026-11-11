import type { Metadata } from "next";
import { editableCopy } from "../../config/content";

const { about } = editableCopy;
const hasContent = Boolean(about.description) || about.sections.length > 0;

export const metadata: Metadata = {
  title: about.title,
  description: about.description || "Conoce a Soriano Grupo Inmobiliario, inmobiliaria en Cubelles.",
  alternates: { canonical: "/quienes-somos" },
  ...(hasContent ? {} : { robots: { index: false, follow: true } }),
};

export default function AboutPage() {
  return <main>
    <section className="page-hero site-shell"><h1>{about.title}</h1>{about.description && <p>{about.description}</p>}</section>
    {about.sections.length > 0 && <section className="about-sections site-shell">{about.sections.map((section) => <article key={section.title}><h2>{section.title}</h2><p>{section.text}</p></article>)}</section>}
  </main>;
}
