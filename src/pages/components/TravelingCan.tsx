import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OVERLAY_STAGES } from '@/constants/Data';

gsap.registerPlugin(ScrollTrigger);

const TravelingCan = () => {
  const canRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setTimeout(() => {
        const can = canRef.current;
        const firstOverlayItem = document.querySelector<HTMLElement>('.overlay-item');
        const landingEl = document.querySelector<HTMLElement>('[data-can-landing]');

        if (!can || !firstOverlayItem || !landingEl) return;

        // ── Initial state: hidden, fixed ─────────────────────────────
        gsap.set(can, {
          position: 'fixed',
          opacity: 0,
          width: 220,
          zIndex: 11,
          pointerEvents: 'none',
          xPercent: -50,
          yPercent: -50,
          left: window.innerWidth * 0.5,
          top: window.innerHeight * 0.45,
        });

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        // ── Single ScrollTrigger with onUpdate scrub ──────────────────
        ScrollTrigger.create({
          trigger: '#about-section',
          start: 'top bottom',
          end: 'top 15%',
          scrub: 1.5,
          markers: true,

          onEnter: () => {
            // Snapshot positions at the moment about section enters
            const itemRect = firstOverlayItem.getBoundingClientRect();
            startX = itemRect.left + itemRect.width / 2;
            startY = itemRect.top + itemRect.height / 2;

            const landingRect = landingEl.getBoundingClientRect();
            endX = landingRect.left + landingRect.width / 2;
            endY = landingRect.top + landingRect.height / 2;

            // Completely remove the hero can from rendering — no shadow ghost
            gsap.set(firstOverlayItem, {
              visibility: 'hidden',
              opacity: 0,
            });

            // Place traveling can exactly on top of where the hero can was
            gsap.set(can, {
              left: startX,
              top: startY,
              opacity: 1,
              scale: 1,
              rotation: 0,
            });
          },

          onUpdate: (self) => {
            const p = self.progress;

            // Interpolate position manually so we always have current coords
            const currentLandingRect = landingEl.getBoundingClientRect();
            const liveEndX = currentLandingRect.left + currentLandingRect.width / 2;
            const liveEndY = currentLandingRect.top + currentLandingRect.height / 2;

            gsap.set(can, {
              left: startX + (liveEndX - startX) * p,
              top: startY + (liveEndY - startY) * p,
              scale: 1 + p * 0.12,
              rotation: p * -6,
              opacity: Math.min(1, p * 3), // quick fade-in at start
            });
          },

          onLeaveBack: () => {
            // User scrolled back into hero — restore everything
            gsap.set(can, { opacity: 0 });
            gsap.set(firstOverlayItem, {
              visibility: 'visible',
              opacity: 1,
            });
          },

          onLeave: () => {

            gsap.set(can, {
              position: 'absolute',
              left: '50%',
              top: '50%',
              xPercent: -50,
              yPercent: -50,
              scale: 1.12,
              rotation: -6,
              opacity: 1,
            });

            // Move the DOM node inside the landing zone so absolute coords work
            landingEl.appendChild(can);
          },

          onEnterBack: () => {
            // Scrolling back up from below — pull can back to fixed
            document.body.appendChild(can);

            const landingRect = landingEl.getBoundingClientRect();
            gsap.set(can, {
              position: 'fixed',
              left: landingRect.left + landingRect.width / 2,
              top: landingRect.top + landingRect.height / 2,
              xPercent: -50,
              yPercent: -50,
              scale: 1.12,
              rotation: -6,
              opacity: 1,
            });
          },
        });
      }, 150);
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <img
      ref={canRef}
      src={OVERLAY_STAGES[0].src}
      alt=""
      aria-hidden="true"
      style={{
        filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.5))',
        willChange: 'transform, opacity',
        userSelect: 'none',
      }}
      draggable={false}
    />
  );
};

export default TravelingCan;