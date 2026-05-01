import  { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { OVERLAY_STAGES } from "../../constants/Data";

// ─── Configuration ────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 300;
const IMAGE_BASE_PATH = "/src/assets/compressed/";
const IMAGE_PREFIX = "ezgif-frame-";
const IMAGE_EXT = ".webp";
const ANIMATION_DURATION = 6.8;

export default function CinematicScatteredSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const framesRef = useRef<HTMLImageElement[]>([]);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // 1. Preloader logic (Keeping your high-speed batching)
  const preloadAll = useCallback(async () => {
    const pad = (n: number) => String(n).padStart(3, "0");
    const loadImg = (i: number): Promise<HTMLImageElement> => 
      new Promise((res) => {
        const img = new Image();
        img.src = `${IMAGE_BASE_PATH}${IMAGE_PREFIX}${pad(i + 1)}${IMAGE_EXT}`;
        img.onload = () => {
          setProgress(Math.round(((i + 1) / TOTAL_FRAMES) * 100));
          res(img);
        };
        img.onerror = () => res(img);
      });

    const images = [];
    for (let i = 0; i < TOTAL_FRAMES; i += 25) {
      const batch = await Promise.all(
        Array.from({ length: Math.min(25, TOTAL_FRAMES - i) }, (_, k) => loadImg(i + k))
      );
      images.push(...batch);
    }
    framesRef.current = images;
    setIsLoaded(true);
  }, []);

  // 2. Optimized Canvas Draw
  const drawToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dW = img.naturalWidth * scale;
    const dH = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dW) / 2, (h - dH) / 2, dW, dH);
  }, []);

  useEffect(() => { preloadAll(); }, [preloadAll]);

  // 3. The Scattering Animation Logic
  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline();

      // Background Sequence
      masterTl.to({}, {
        duration: ANIMATION_DURATION,
        ease: "none",
        onUpdate: function() {
          const idx = Math.floor(this.progress() * (TOTAL_FRAMES - 1));
          if (framesRef.current[idx]) drawToCanvas(framesRef.current[idx]);
        }
      }, 0);

      // Revised Configuration for all 4 items
      const layerConfig = [
        { x: 0,    y: 0,   z: 200, scale: 1.2, blur: 0, delay: 0 },    // Sprite (Center)
        { x: -380, y: 40,  z: 100, scale: 0.8, blur: 2, delay: 0.08 }, // Coke (Left)
        { x: 380,  y: 40,  z: 100, scale: 0.8, blur: 2, delay: 0.16 }, // Fanta (Right)
        { x: 0,    y: -80, z: -100, scale: 0.5, blur: 6, delay: 0.24 }  // Pepsi (Back)
      ];

      brandRefs.current.forEach((el, i) => {
        if (!el || !layerConfig[i]) return;
        const cfg = layerConfig[i];

        // The "Scattering" effect: Start from center, rotate, and blast outward
        gsap.fromTo(el, 
          { 
            opacity: 0, 
            scale: 0.2, 
            x: 0, // All start from center for the scatter feel
            y: 0,
            rotationX: Math.random() * 45,
            rotationY: Math.random() * 45,
            filter: `blur(20px) brightness(2)`,
          },
          {
            opacity: 1,
            scale: cfg.scale,
            x: cfg.x,
            y: cfg.y,
            rotationX: 0,
            rotationY: 0,
            filter: `blur(${cfg.blur}px) brightness(1)`,
            duration: 1.8,
            delay: cfg.delay,
            ease: "expo.out", // Sharp entrance, smooth settle
          }
        );

        // Continuous subtle float (Parallax)
        // gsap.to(el, {
        //   y: `+=${i % 2 === 0 ? 15 : -15}`,
        //   duration: 3,
        //   repeat: -1,
        //   yoyo: true,
        //   ease: "sine.inOut"
        // });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded, drawToCanvas]);

  return (
    <div className="sequence-root" ref={containerRef}>
      <style>{`
        .sequence-root {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: #000;
          overflow: hidden;
          perspective: 2000px; /* Stronger perspective for depth */
        }
        // .bg-canvas {
        //   position: absolute;
        //   inset: 0;
        //   filter: brightness(0.4) saturate(1.2);
        // }
        .brand-layer {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          transform-style: preserve-3d;
        }
        .brand-img {
        
          max-height: 60vh;
          object-fit: contain;
          filter: drop-shadow(0 0 40px rgba(0,0,0,0.8));
        }
        .loader {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.5em;
        }
      `}</style>

      {!isLoaded && <div className="loader">LOADING {progress}%</div>}

      {/* <canvas ref={canvasRef} className="bg-canvas" /> */}

      {/* Mapping ensures all 4 items from OVERLAY_STAGES are rendered */}
      {OVERLAY_STAGES.map((stage, i) => (
        <div 
          key={`brand-${i}`} 
          className="brand-layer" 
          ref={(el) => {
            if(el){
              brandRefs.current[i] = el
            }
          }}
          style={{ zIndex: 10 - i }} 
        >
          <img src={stage.src} alt={`brand-${i}`} className="brand-img" />
        </div>
      ))}
    </div>
  );
}