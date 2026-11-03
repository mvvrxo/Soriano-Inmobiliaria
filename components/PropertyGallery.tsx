"use client";

import { useRef } from "react";

/** Keeps the original three-photo layout and adds a viewer with every photo. */
export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const open = (index = 0) => {
    dialog.current?.showModal();
    dialog.current?.querySelectorAll("img")[index]?.scrollIntoView({ block: "start" });
  };

  if (!images.length) return <section className="detail-gallery site-shell"><div className="detail-fallback">Soriano Grupo Inmobiliario</div></section>;

  return <section className="detail-gallery site-shell">
    {images.slice(0, 3).map((image, index) => <button type="button" className="detail-gallery-item" key={`${image}-${index}`} onClick={() => open(index)} aria-label={`Ampliar fotografía ${index + 1} de ${images.length}`}>
      <img src={image} alt={`${title}${index ? `, imagen ${index + 1}` : ""}`} fetchPriority={index === 0 ? "high" : undefined} loading={index === 0 ? "eager" : "lazy"} />
    </button>)}
    {images.length > 1 && <button type="button" className="detail-gallery-all" onClick={() => open(0)}>Ver las {images.length} fotos</button>}
    <dialog ref={dialog} className="gallery-dialog" aria-label={`Fotografías de ${title}`}>
      <div className="gallery-dialog-bar"><span>{title} · {images.length} fotos</span><button type="button" onClick={() => dialog.current?.close()}>Cerrar ×</button></div>
      <div className="gallery-dialog-list">{images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${title}, imagen ${index + 1} de ${images.length}`} loading="lazy" />)}</div>
    </dialog>
  </section>;
}
