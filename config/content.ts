/**
 * Copy for the public site. Replace bracketed text with the final company copy.
 * Keeping it here prevents marketing text from becoming scattered through UI components.
 */
export const editableCopy = {
  hero: {
    eyebrow: "SORIANO GRUPO INMOBILIARIO · CUBELLES",
    title: "Inmobiliaria en Cubelles",
    description: "Acompañamos a propietarios que quieren vender su vivienda y a personas que buscan comprar en Cubelles y la Costa del Garraf.",
  },
  buy: {
    title: "Catálogo de propiedades",
    description: "Te ayudamos a encontrar una vivienda que encaje con tu búsqueda, tu presupuesto y la zona que necesitas.",
    label: "BÚSQUEDA DE VIVIENDA",
  },
  sell: {
    title: "Vender tu vivienda",
    // Intro on the Vender page; the home page uses homeDescription.
    description: "Cada vivienda tiene unas particularidades y unas circunstancias propias. Por eso, abordamos cada operación de forma individual, con un análisis previo, una estrategia de comercialización y un seguimiento cercano durante todo el proceso de venta.",
    homeDescription: "Cada vivienda requiere una estrategia de venta. Analizamos sus características y el mercado para definir cómo comercializarla y acompañarte durante todo el proceso.",
    label: "PARA PROPIETARIOS",
  },
  contact: {
    title: "Contacto",
    // Intro on the Contacto page; the home page uses homeDescription.
    description: "Cuéntanos qué necesitas y te responderemos con la información adecuada para tu caso.",
    homeDescription: "¿Estás pensando en vender, comprar o necesitas más información? Estamos aquí para ayudarte. Cuéntanos qué necesitas y hablamos.",
  },
  // Pending final copy. Fill `description` and add `sections` ({ title, text }) when the content is ready;
  // the page stays out of search engines until it has content.
  about: {
    title: "Quiénes somos",
    description: "",
    sections: [] as ReadonlyArray<{ title: string; text: string }>,
  },
} as const;
