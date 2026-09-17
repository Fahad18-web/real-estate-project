import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export default function PropertyImageGallery({ images = [], title = 'Property Image' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const imageList =
    images.length > 0
      ? images
      : [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        ];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Hero Image view */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-video w-full rounded-3xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-default)] cursor-pointer group shadow-sm"
      >
        <img
          src={imageList[currentIndex]}
          alt={`${title} - view ${currentIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
          }}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-black transition"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black transition border border-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black transition border border-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-mono text-white border border-white/10">
          {currentIndex + 1} / {imageList.length}
        </div>
      </div>

      {/* Thumbnails row */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition ${
                currentIndex === idx
                  ? 'border-[#6C63FF] scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-[#1A1A24] text-white hover:bg-white/20 transition"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={imageList[currentIndex]}
            alt="fullscreen view"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
          />

          {imageList.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#1A1A24] text-white hover:bg-[#6C63FF] transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#1A1A24] text-white hover:bg-[#6C63FF] transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
