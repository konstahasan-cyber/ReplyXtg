"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectImage } from "@/config/projects";
import { ConceptLabel } from "@/components/ui/Section";

/** Editorial image grid with an accessible lightbox (native <dialog>, arrow keys, swipe). */
export function Gallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [step]);

  const layout = ["md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto", "md:col-span-5 aspect-[4/3]", "md:col-span-5 aspect-[4/3]", "md:col-span-12 aspect-[16/9]"];

  return (
    <>
      <ul className="grid gap-4 md:grid-cols-12 md:gap-5">
        {images.map((img, i) => (
          <li key={img.src} className={`${layout[i % layout.length]} relative`}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group relative block h-full w-full overflow-hidden bg-sand"
              aria-label={`Open image ${i + 1} of ${images.length}: ${img.caption}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={i === 3 ? "100vw" : i === 0 ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 42vw, 100vw"}
                className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
              />
              <span className="scrim-bottom absolute inset-x-0 bottom-0 h-1/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
              <span className="absolute bottom-4 left-4 right-4 translate-y-2 text-left text-sm text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                {img.caption}
              </span>
            </button>
            <ConceptLabel className="pointer-events-none absolute left-3 top-3">Concept rendering</ConceptLabel>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        aria-label={`${title} gallery`}
        className="m-0 h-full max-h-none w-full max-w-none bg-charcoal/97 p-0 text-ivory backdrop:bg-charcoal"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {index !== null && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-4 text-sm">
              <p aria-live="polite">
                {index + 1} / {images.length} · <span className="text-ivory/70">{images[index].caption}</span>
              </p>
              <button type="button" onClick={() => dialog.current?.close()} className="-m-2 p-2 text-3xl leading-none" aria-label="Close gallery">
                ×
              </button>
            </div>
            <div className="relative flex-1">
              <Image key={images[index].src} src={images[index].src} alt={images[index].alt} fill sizes="100vw" className="animate-[page-in_0.4s_ease_both] object-contain" />
            </div>
            <div className="flex items-center justify-between px-5 py-5">
              <button type="button" onClick={() => step(-1)} className="border border-ivory/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-ivory hover:text-charcoal">
                ← Previous
              </button>
              <p className="hidden text-xs uppercase tracking-[0.16em] text-ivory/50 sm:block">Concept rendering — not a completed home</p>
              <button type="button" onClick={() => step(1)} className="border border-ivory/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-ivory hover:text-charcoal">
                Next →
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
