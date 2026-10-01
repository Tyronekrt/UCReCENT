"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/types";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@/types";

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [category, setCategory] = useState<GalleryCategory>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const filtered = category === "All" ? images : images.filter((g) => g.category === category);

  const openAt = useCallback(
    (src: string) => {
      const idx = filtered.findIndex((g) => g.src === src);
      setLightbox(idx >= 0 ? idx : 0);
    },
    [filtered]
  );

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) => (cur === null ? cur : (cur + dir + filtered.length) % filtered.length));
    },
    [filtered.length]
  );

  // Keyboard support + focus management + scroll lock for the lightbox
  useEffect(() => {
    if (lightbox === null) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  if (images.length === 0) {
    return (
      <div className="card mt-8 max-w-2xl" role="status">
        <h2 className="font-bold text-navy">No photos published yet.</h2>
        <p className="mt-2 text-sm text-slate-600">
          The project team has not released verified gallery images. Check back soon.
        </p>
      </div>
    );
  }

  const current: GalleryImage | null = lightbox !== null ? filtered[lightbox] : null;

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter gallery by category">
        {GALLERY_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCategory(c);
              setLightbox(null);
            }}
            aria-pressed={category === c}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy ${
              category === c ? "bg-navy text-white" : "border border-slate-300 bg-white text-slate-700 hover:border-navy"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-slate-500" role="status" aria-live="polite">
        Showing {filtered.length} of {images.length} images{category !== "All" ? ` in ${category}` : ""}.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((g) => (
          <figure key={g.src} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => openAt(g.src)}
              className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy"
              aria-label={`View larger: ${g.caption}`}
            >
              <Image
                src={g.src}
                alt={g.alt}
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-200 hover:scale-[1.02] motion-reduce:hover:scale-100"
              />
            </button>
            <figcaption className="flex items-start justify-between gap-2 px-4 py-3">
              <span className="text-sm text-slate-600">{g.caption}</span>
              <span className="status-pill shrink-0 bg-slate-100 text-slate-600">{g.category}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image viewer: ${current.caption}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 p-4"
          onClick={close}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                src={current.src}
                alt={current.alt}
                width={1200}
                height={900}
                className="max-h-[70vh] w-full object-contain bg-slate-900"
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <p className="text-sm text-slate-700">
                <strong>{current.caption}</strong>
                <span className="block text-xs text-slate-500">
                  {(lightbox ?? 0) + 1} of {filtered.length} · {current.category} · ← → to navigate, Esc to close
                </span>
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-lg font-bold text-navy hover:bg-slate-100"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-lg font-bold text-navy hover:bg-slate-100"
                >
                  ›
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close image viewer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-lg font-bold text-white hover:bg-navy-light"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
