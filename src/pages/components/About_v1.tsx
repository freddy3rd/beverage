// AboutSection.tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { images } from '@/constants/Image';

gsap.registerPlugin(ScrollTrigger);

const LEAVES = [
  { src: images.leaf_3, top: '10%', left: '10px', size: 250, rotation:  -5, blur: 0.5, opacity: 0.78, parallaxY: -206, zIndex: 12 },
  { src: images.leaf_3, top: '15%', left: '10%', size: 100, rotation:  90, blur: 0.5, opacity: 0.78, parallaxY: -36, zIndex: 10 },

];

function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Staggered text reveal
    gsap.fromTo(
      '.about-text > *',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 55%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Subtle scale-in on the landing zone
    gsap.fromTo(
      '[data-can-landing]',
      { backgroundColor: 'rgba(255,255,255,1)' },
      {
        backgroundColor: 'rgba(240,245,255,1)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <div
      id="about-section"
      ref={sectionRef}
      className="grid grid-cols-2 min-h-screen"
    >
      {/* LEFT — can landing zone */}
      <div
        data-can-landing
        className="relative flex items-center justify-center overflow-hidden "
        style={{ background: 'white' }}
      >
        <img src={images.ground_water} className='absolute inset-x-0 bottom-0 object-contain w-full pointer-events-none ' />

       
        {/* Soft radial glow so the can feels at home */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 52%, rgba(91,55,235,0.06) 0%, transparent 70%)',
          }}
        />
        {/* Ghost placeholder preserves grid height before can arrives */}
        {/* <div className="w-56 h-72 opacity-0" aria-hidden="true" /> */}
         {LEAVES.map((leaf, i) =>
          
            <img
              key={`leaf-fg-${i}`}
              src={leaf.src}
              className="pointer-events-none select-none"
              alt=""
              style={{
                filter: `blur(${leaf.blur}px) drop-shadow(0 10px 28px rgba(80,160,80,0.30))`,
                zIndex: leaf.zIndex,
                rotate: `${leaf.rotation}deg`,
                width: leaf.size,
                top: leaf.top,
                left: leaf.left,
                willChange: 'transform, opacity',
              }}
            />
       
        )}
      </div>

      {/* RIGHT — text content */}
      <div className="flex flex-col justify-center p-12 bg-gray-50">
        <div className="about-text">
         
          <h2
            className="text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] text-[#0f172a]"
          >
            Sip the Spark
          </h2>
          
          <p className="mt-3 text-base text-gray-400 leading-relaxed max-w-sm">
            Beyond the fizz. A crisp, citrus-infused evolution of the world’s most iconic refresher. Cold-filtered and precision-bottled at the peak of flavor.
          </p>
          <button
            className="mt-8 self-start px-8 py-3 text-sm font-bold tracking-widest uppercase text-white rounded-full"
            style={{
              background: 'linear-gradient(135deg, #00b4d8, #5b37eb)',
            }}
          >
            Our Story
          </button>
        </div>
      </div>

    </div>
  );
}

export default AboutSection;