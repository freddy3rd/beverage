import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { OVERLAY_STAGES } from '@/constants/Data';
import { images } from '@/constants/Image';

gsap.registerPlugin(ScrollTrigger);

const ICE_CUBES = [
  { src: images.ice_cube_1, top: '12%', left: '8%',  size: 180,  rotation: -28, blur: 6,   opacity: 0.35, parallaxY: -18, zIndex: 0 },
  { src: images.ice_cube_3, top: '18%', left: '78%', size: 72,  rotation:  40, blur: 5,   opacity: 0.30, parallaxY: -14, zIndex: 0 },
  { src: images.ice_cube_5, top: '72%', left: '88%', size: 68,  rotation: -15, blur: 6,   opacity: 0.28, parallaxY: -16, zIndex: 0 },
  { src: images.ice_cube_2, top: '18%',  left: '38%', size: 160, rotation:  18, blur: 3,   opacity: 0.50, parallaxY: -28, zIndex: 0 },
  { src: images.ice_cube_4, top: '70%', left: '14%', size: 96,  rotation: -35, blur: 3.5, opacity: 0.45, parallaxY: -24, zIndex: 0 },
  { src: images.ice_cube_1, top: '78%', left: '60%', size: 188,  rotation:  52, blur: 3,   opacity: 0.48, parallaxY: -22, zIndex: 0 },
  { src: images.ice_cube_3, top: '55%', left: '2%',  size: 230, rotation: -12, blur: 0.5, opacity: 0.80, parallaxY: -42, zIndex: 10 },
  { src: images.ice_cube_2, top: '62%', left: '91%', size: 220, rotation:  25, blur: 0,   opacity: 0.85, parallaxY: -50, zIndex: 10 },
  { src: images.ice_cube_5, top: '5%',  left: '62%', size: 210, rotation: -42, blur: 1,   opacity: 0.72, parallaxY: -38, zIndex: 10 },
];

const FanAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.product-container');
      const cans = gsap.utils.toArray<HTMLElement>('.overlay-item');
      const descriptions = gsap.utils.toArray<HTMLElement>('.can-description');
      const total = items.length;
      const gap = 100 / (total + 1);

      // ── 1. INITIAL SETUP ──────────────────────────────────────────
      gsap.set([items], {
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        position: 'absolute',
      });


      gsap.set(cans, {
        opacity: 0,
        transformOrigin: '50% 100%',
        rotation: (i) => (i - (total - 1) / 2) * 22,
        y: (i) => Math.abs(i - (total - 1) / 2) * -14,
      });

      gsap.set(descriptions, { opacity: 0, y: 30 });

      // ── 2. ON LOAD ANIMATION ──────────────────────────────────────
      const loadTl = gsap.timeline({ delay: 0.3 });
      loadTl.to(cans, {
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
      })

      gsap.fromTo('.title-container h1',{
        y: 100
      },
      {
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.02,
      })

      


      // ── 3. SCROLL TIMELINE ────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stickyRef.current,
          start: 'top top',
          end: `+=${total * 130}vh`,
          scrub: 1,
          pin: true,
        },
      });

      const headerTlScroll = gsap.timeline({
        scrollTrigger:{
          trigger: headlineRef.current,
          start: 'top top',
          toggleActions: "play reverse play reverse",
        }
      })

      
      headerTlScroll.to('.title-container h1',{
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.inOut',
      }, 0);

      // Transition cans to row
      tl.to(cans, { rotation: 0, y: 0, duration: 1, stagger: 0.06 }, 0);
      tl.to(items, {
        left: (i) => `${gap * (i + 1)}%`,
        top: '45%',
        duration: 1,
        stagger: 0.06
      }, 0);

      // Fade in descriptions
      tl.to(descriptions, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
      }, "-=0.3");

      // ── 3. ICE CUBES: Burst on Load ────────────────────────────────
      const iceCubes = gsap.utils.toArray<HTMLElement>('.ice-cube');
      gsap.set(iceCubes, {
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        scale: 0,
        opacity: 0,
        position: 'absolute',
        width: (i) => ICE_CUBES[i].size,
      });

      tl.to('.ice-cube', {
        y: (i) => ICE_CUBES[i].parallaxY * 10, // Multiplier increases the intensity
        ease: 'none', // Critical for smooth scrubbing
        duration: 1
      }, 0);

      gsap.to(iceCubes, {
        top: (i) => ICE_CUBES[i].top,
        left: (i) => ICE_CUBES[i].left,
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        opacity: (i) => ICE_CUBES[i].opacity,
        rotation: (i) => ICE_CUBES[i].rotation,
        ease: 'power4.out',
        duration: 1.2,
        // stagger: { each: 0.06, from: 'center' },
        delay: 0.2,
      });

      // ── 4. HOVER INTERACTION ──────────────────────────────────────
      cans.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          gsap.to(el, { scale: 1.08, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black"
      style={{ height: `${OVERLAY_STAGES.length * 120 + 200}vh` }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ perspective: '1200px' }}
      >

        <div 
          ref={headlineRef} 
          className="z-50 flex pointer-events-none w-full h-full relative justify-center items-center"
        >
        <div className='title-container overflow-y-hidden'>
            <h1
            id="hero-headline"
            className="font-extrabold text-[#0f172a] mb-2 leading-[0.92] tracking-[-0.04em] text-[clamp(52px,10vw,112px)] justify-self-center"
          >
            REFRESH
          </h1>
        </div>
        <div className='title-container overflow-y-hidden'>
          <h1
           className='font-extrabold mb-2 leading-[0.92] tracking-[-0.04em] text-[clamp(52px,10vw,112px)] mt-40 '
            style={{
              background: 'linear-gradient(135deg, #00b4d8, #5b37eb)', // Slightly deeper gradient
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SUMMER
          </h1>
        </div>
        </div>

        {/* Background Glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(120,80,255,0.12) 0%, transparent 70%)',
          }}
        />
        <img src='/src/assets/background.png' className='absolute inset-0 object-cover w-full pointer-events-none'/>
        
        {/* Ice Cubes: Background Layer */}
        {ICE_CUBES.map((cube, i) =>
          cube.zIndex === 0 && (
            <img
              key={`ice-bg-${i}`}
              src={cube.src}
              className="ice-cube pointer-events-none select-none"
              alt=""
              style={{
                filter: `blur(${cube.blur}px) drop-shadow(0 8px 24px rgba(180,220,255,0.25))`,
                zIndex: 0,
              }}
            />
          )
        )}

        {/* Cans & Descriptions */}
        {OVERLAY_STAGES.map((item, index) => (
          <div key={index} className="product-container flex flex-col items-center w-64 relative">
            <img
              src={item.src}
              className="overlay-item w-44 md:w-56 h-auto cursor-pointer select-none"
              style={{
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.45))',
                zIndex: index + 1,
              }}
              alt={`product-${index}`}
              draggable={false}
            />
            <div className={`can-description mt-8 capitalize px-4 py-6 
                bg-white/20 backdrop-blur-md rounded-sm 
                shadow-lg
                absolute  z-10 ${item.description['x']} ${item.description['y']}`}>
              {/* <h3 className="font-black text-2xl tracking-widest uppercase mb-2 drop-shadow-md text-[#101010]">{item.title}</h3> */}
              <p className="text-sm leading-relaxed max-w-[250px] text-[#101010] font-bold font-sans">
                {item.description['text']}
              </p>
            </div>
          </div>
        ))}

        {/* Ice Cubes: Foreground Layer */}
        {ICE_CUBES.map((cube, i) =>
          cube.zIndex === 10 && (
            <img
              key={`ice-fg-${i}`}
              src={cube.src}
              className="ice-cube pointer-events-none select-none "
              alt=""
              style={{
                filter: `blur(${cube.blur}px) drop-shadow(0 12px 32px rgba(180,220,255,0.35))`,
                zIndex: 10,
              }}
            />
          )
        )}

       
      </div>
    </div>
  );
};

export default FanAnimation;