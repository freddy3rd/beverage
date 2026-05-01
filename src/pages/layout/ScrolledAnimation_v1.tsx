import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Configuration ────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 300;
const IMAGE_BASE_PATH = "/src/assets/compressed/"; // adjust to your image directory
const IMAGE_PREFIX = "ezgif-frame-";
const IMAGE_EXT = ".webp";

// Overlay copy shown at different scroll positions
const OVERLAY_STAGES = [
  { from: 0,    to: 0.15, heading: "A Journey Begins",   sub: "Scroll to explore"             },
  { from: 0.15, to: 0.35, heading: "The World Unfolds",  sub: "Frame by frame"                },
  { from: 0.35, to: 0.55, heading: "Every Detail",       sub: "Rendered in motion"            },
  { from: 0.55, to: 0.75, heading: "The Story Deepens",  sub: "Keep going"                    },
  { from: 0.75, to: 0.90, heading: "Almost There",       sub: "The end approaches"            },
  { from: 0.90, to: 1.00, heading: "The Final Frame",    sub: "Thank you for the journey"     },
];

// Pad number → "001"
const padFrame = (n: number) => String(n).padStart(3, "0");

// ─── Types ────────────────────────────────────────────────────────────────────
interface OverlayStage {
  heading: string;
  sub: string;
  opacity: number;
}

// ─── Utility: preload all frames ──────────────────────────────────────────────
async function preloadImages(
  onProgress?: (loaded: number, total: number) => void
): Promise<HTMLImageElement[]> {
  const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

  const load = (index: number): Promise<void> =>
    new Promise((resolve) => {
      const img = new Image();
      const frameNum = padFrame(index + 1);
      img.src = `${IMAGE_BASE_PATH}${IMAGE_PREFIX}${frameNum}${IMAGE_EXT}`;
      console.log(img.src)
      img.onload = () => {
        images[index] = img;
        onProgress?.(index + 1, TOTAL_FRAMES);
        resolve();
      };
      img.onerror = () => {
        // On error create a placeholder so the array stays dense
        images[index] = img;
        onProgress?.(index + 1, TOTAL_FRAMES);
        resolve();
      };
    });

  // Load in parallel batches of 20 to avoid overwhelming the browser
  const BATCH = 20;
  for (let i = 0; i < TOTAL_FRAMES; i += BATCH) {
    const batch = Array.from(
      { length: Math.min(BATCH, TOTAL_FRAMES - i) },
      (_, k) => load(i + k)
    );
    await Promise.all(batch);
  }

  return images;
}

// ─── Utility: draw one frame onto canvas (object-fit: cover) ─────────────────
function drawImageToCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number
) {
  if (!img || !img.naturalWidth) return;

  const scale = Math.max(canvasW / img.naturalWidth, canvasH / img.naturalHeight);
  const drawW = img.naturalWidth * scale;
  const drawH = img.naturalHeight * scale;
  const offsetX = (canvasW - drawW) / 2;
  const offsetY = (canvasH - drawH) / 2;

  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

// ─── Utility: resolve overlay stage for a given scroll progress ───────────────
function resolveOverlay(progress: number): OverlayStage | null {
  for (const stage of OVERLAY_STAGES) {
    if (progress >= stage.from && progress <= stage.to) {
      // Fade in/out within the stage window
      const half = (stage.to - stage.from) / 2;
      const mid = stage.from + half;
      const dist = Math.abs(progress - mid);
      const opacity = Math.max(0, 1 - dist / half);
      return { heading: stage.heading, sub: stage.sub, opacity };
    }
  }
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ImageSequenceScroll() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const loaderRef   = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Mutable refs shared with GSAP callbacks (no re-renders)
  const framesRef      = useRef<HTMLImageElement[]>([]);
  const lastFrameRef   = useRef<number>(-1);
  const scrollProgress = useRef<number>(0);
  const rafId          = useRef<number>(0);

  // ── Resize handler: rescale canvas ──────────────────────────────────────────
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Redraw current frame after resize
    const frames = framesRef.current;
    const idx = Math.round(scrollProgress.current * (TOTAL_FRAMES - 1));
    if (frames[idx]) drawImageToCanvas(ctx, frames[idx], w, h);
  }, []);

  // ── Main render loop driven by GSAP ticker ───────────────────────────────────
  const renderLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames.length) return;

    const progress  = scrollProgress.current;
    const frameIdx  = Math.min(
      Math.round(progress * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1
    );

    // Lazy draw — only when frame changes
    if (frameIdx !== lastFrameRef.current) {
      lastFrameRef.current = frameIdx;
      const ctx = canvas.getContext("2d");
      if (ctx && frames[frameIdx]) {
        drawImageToCanvas(ctx, frames[frameIdx], window.innerWidth, window.innerHeight);
      }
    }

    // Overlay update
    const stage = resolveOverlay(progress);
    const heading = headingRef.current;
    const sub     = subRef.current;

    if (heading && sub) {
      if (stage) {
        heading.textContent = stage.heading;
        sub.textContent     = stage.sub;
        heading.style.opacity = String(stage.opacity);
        sub.style.opacity     = String(stage.opacity);
      } else {
        heading.style.opacity = "0";
        sub.style.opacity     = "0";
      }
    }
  }, []);

  // ── Setup GSAP ScrollTrigger animation ──────────────────────────────────────
  const setupScrollAnimation = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.ticker.add(renderLoop);

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=300%",
      scrub: true,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });
  }, [renderLoop]);

  // ── Mount / unmount ──────────────────────────────────────────────────────────
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    const loader  = loaderRef.current;
    const progBar = progressRef.current;

    // Show loader, preload, then animate in
    preloadImages((loaded, total) => {
      if (progBar) progBar.style.width = `${(loaded / total) * 100}%`;
    }).then((images) => {
      framesRef.current = images;

      // Hide loader
      if (loader) {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => { loader.style.display = "none"; },
        });
      }

      // Draw first frame
      const canvas = canvasRef.current;
      if (canvas && images[0]) {
        const ctx = canvas.getContext("2d");
        if (ctx) drawImageToCanvas(ctx, images[0], window.innerWidth, window.innerHeight);
      }

      setupScrollAnimation();
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.ticker.remove(renderLoop);
      cancelAnimationFrame(rafId.current);
    };
  }, [handleResize, setupScrollAnimation, renderLoop]);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Global styles injected inline for portability */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Syne:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: auto; }

        body {
          background: #0a0a0a;
          color: #f0ece4;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
        }

        /* ── Section ── */
        .seq-section {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }

        /* ── Canvas ── */
        .seq-canvas {
          display: block;
          position: absolute;
          inset: 0;
        }

        /* ── Vignette ── */
        .seq-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center,
            transparent 40%,
            rgba(0,0,0,0.55) 100%
          );
          pointer-events: none;
        }

        /* ── Overlay text ── */
        .seq-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 10vh;
          pointer-events: none;
          text-align: center;
        }

        .seq-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(2.5rem, 6vw, 6rem);
          letter-spacing: 0.04em;
          line-height: 1.1;
          color: #f0ece4;
          text-shadow: 0 2px 40px rgba(0,0,0,0.7);
          opacity: 0;
          transition: opacity 0.15s ease;
          will-change: opacity;
        }

        .seq-sub {
          margin-top: 0.75rem;
          font-family: 'Syne', sans-serif;
          font-size: clamp(0.75rem, 1.4vw, 1rem);
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(240, 236, 228, 0.7);
          opacity: 0;
          transition: opacity 0.15s ease;
          will-change: opacity;
        }

        /* ── Progress pill ── */
        .seq-progress-pill {
          position: absolute;
          top: 2rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(240,236,228,0.45);
        }

        .seq-frame-counter {
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem;
          min-width: 3.5ch;
          text-align: right;
        }

        /* ── Scroll hint ── */
        .seq-scroll-hint {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: rgba(240,236,228,0.4);
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          animation: bounceArrow 2s ease-in-out infinite;
        }

        .seq-scroll-arrow {
          width: 1px;
          height: 2.5rem;
          background: linear-gradient(to bottom, rgba(240,236,228,0.4), transparent);
        }

        @keyframes bounceArrow {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(6px); }
        }

        /* ── Loader overlay ── */
        .seq-loader {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }

        .seq-loader-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          letter-spacing: 0.1em;
          color: rgba(240,236,228,0.8);
        }

        .seq-loader-track {
          width: clamp(200px, 40vw, 400px);
          height: 1px;
          background: rgba(240,236,228,0.12);
          position: relative;
          overflow: hidden;
        }

        .seq-loader-bar {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #c8a96e, #f0ece4);
          transition: width 0.1s linear;
          box-shadow: 0 0 12px rgba(200,169,110,0.5);
        }

        .seq-loader-label {
          font-size: 0.65rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(240,236,228,0.3);
        }

        /* ── Below-fold spacer ── */
        .seq-spacer {
          height: 300vh;
          background: #0a0a0a;
        }

        /* ── End section ── */
        .seq-end {
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 1.5rem;
          text-align: center;
          padding: 4rem 2rem;
        }

        .seq-end h2 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(2rem, 5vw, 4rem);
          letter-spacing: 0.05em;
          color: rgba(240,236,228,0.85);
        }

        .seq-end p {
          font-size: 0.85rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(240,236,228,0.3);
        }
      `}</style>

      {/* ── Loader ── */}
      <div className="seq-loader" ref={loaderRef}>
        <p className="seq-loader-title">Loading Sequence</p>
        <div className="seq-loader-track">
          <div className="seq-loader-bar" ref={progressRef} />
        </div>
        <p className="seq-loader-label">Preloading frames</p>
      </div>

      {/* ── Pinned canvas section ── */}
      <div className="seq-section" ref={sectionRef}>
        <canvas className="seq-canvas" ref={canvasRef} />

        {/* Vignette */}
        <div className="seq-vignette" />

        {/* Overlay text */}
        <div className="seq-overlay">
          <h2 className="seq-heading" ref={headingRef} />
          <p  className="seq-sub"     ref={subRef}     />
        </div>

        {/* Frame counter */}
        <div className="seq-progress-pill">
          <FrameCounter scrollProgress={scrollProgress} />
        </div>

        {/* Scroll hint */}
        <div className="seq-scroll-hint">
          <span>Scroll</span>
          <div className="seq-scroll-arrow" />
        </div>
      </div>

      {/* Spacer that creates scroll height for ScrollTrigger end offset */}


    </>
  );
}

// ── Frame counter sub-component (reads ref, updates via rAF) ─────────────────
function FrameCounter({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf: number;
    let last = -1;

    const tick = () => {
      const idx = Math.round(scrollProgress.current * (TOTAL_FRAMES - 1)) + 1;
      if (idx !== last && spanRef.current) {
        spanRef.current.textContent = `${padFrame(idx)} / ${padFrame(TOTAL_FRAMES)}`;
        last = idx;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgress]);

  return (
    <span className="seq-frame-counter" ref={spanRef}>
      001 / 300
    </span>
  );
}