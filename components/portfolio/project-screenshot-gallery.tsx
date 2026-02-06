"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectScreenshot } from "@/data/portfolio";

interface ProjectScreenshotGalleryProps {
  screenshots: ProjectScreenshot[];
  projectName: string;
}

export function ProjectScreenshotGallery({ screenshots, projectName }: ProjectScreenshotGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!screenshots?.length) return null;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () => setLightboxIndex((i) => (i === null ? null : i === 0 ? screenshots.length - 1 : i - 1));
  const goNext = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % screenshots.length));

  const featured = screenshots[0];
  const rest = screenshots.slice(1);

  return (
    <>
      <section className="mb-0">
        {/* Featured image — large, rounded, shadow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
        >
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-2xl"
          >
            <div className="relative aspect-[16/10] sm:aspect-[2/1] w-full">
              <Image
                src={featured.src}
                alt={featured.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
                className="object-cover object-top transition-transform duration-300 hover:scale-[1.02]"
                priority
                quality={90}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs text-white backdrop-blur-sm">
                {featured.type === "mobile" ? <Smartphone className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
                <span>{featured.type === "mobile" ? "Mobile" : "Desktop"}</span>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Grid of remaining screenshots */}
        {rest.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {rest.map((shot, index) => (
              <motion.button
                key={`${shot.src}-${index}`}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * (index + 1) }}
                onClick={() => openLightbox(index + 1)}
                className={cn(
                  "relative overflow-hidden rounded-xl border border-border bg-surface",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
                  "transition-all duration-200 hover:border-accent/50 hover:shadow-lg"
                )}
              >
                <div className="relative aspect-video w-full">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover object-top"
                    loading="lazy"
                    quality={80}
                  />
                </div>
                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/50 px-2 py-1 text-[10px] text-white backdrop-blur-sm">
                  {shot.type === "mobile" ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative h-[85vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={screenshots[lightboxIndex].src}
                alt={screenshots[lightboxIndex].alt}
                fill
                className="rounded-lg object-contain shadow-2xl"
                sizes="90vw"
              />
              <p className="mt-2 text-center text-sm text-white/70">{screenshots[lightboxIndex].alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
