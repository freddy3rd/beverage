import { useRef, useState } from "react";
import { BEVERAGE_CONFIG } from "@/constants/Data";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";

const Hero = () => {
  const [displayIndex, setDisplayIndex] = useState(0);
  const activeCan = BEVERAGE_CONFIG[displayIndex];

  const imageRef = useRef<HTMLImageElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const headlineRef = useRef<any>(null)
  const quoteRef = useRef<any>(null)
  const descRef = useRef<any>(null)
  

 useGSAP(() => {
    if (!headlineRef.current) return;

    const tl = gsap.timeline();
    
    // Create SplitText
    const split = new SplitText(headlineRef.current, { type: "chars" });
    const splitQuote = new SplitText(quoteRef.current, { type: "words" });

    tl.from(containerRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    })
    // 1. Reveal Headline Characters fast
    // 2. Drop the can with a faster bounce
    .from(imageRef.current, {
      y: -800,
      rotate: -20,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)", // Snappier than bounce
    }, "-=0.5")
    .from(split.chars, {
      y: 200,
      // opacity: 0,
      // rotateX: -90, // Adds a 3D flip effect
      autoAlpha: 0,
      stagger: 0.08, // Fast stagger
      duration: 1,
      ease: "expo.out",
    }, "-=0.3")
    .from(splitQuote.words, {
      y: 60,
      opacity: 0,
      // rotateX: -90, // Adds a 3D flip effect
      autoAlpha: 0,
      stagger: 0.08, // Fast stagger
      duration: 1,
      ease: "expo.out",
    }, "-=0.2")
    .from(descRef.current, {
      x: 60,
      opacity: 0,
      ease: "power2.in",
    }, "<")
    // 3. Slide up supporting text
    .from(".animate-text", {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "power3.out",
    }, "-=0.7");

    // Cleanup split text on unmount
    return () => split.revert();
  }, { scope: containerRef });

  // 2. FLAVOR CHANGE ANIMATION (Can swap + BG fade)
  // const handleFlavorChange = (nextIndex: number) => {
  //   if (nextIndex === displayIndex || isAnimating.current) return;

  //   isAnimating.current = true;

  //   console.log(isAnimating.current)


  //   // if(isAnimating.current){
  //   // }
  //   const tl = gsap.timeline({
  //     onComplete: () => {
  //       isAnimating.current = false;
  //     }
  //   });

  //   // Exit: Can moves out and BG fades
  //   tl.to(imageRef.current, {
  //     y: 800,
  //     opacity: 0,
  //     rotate: 10,
  //     duration: 0.4,
  //     ease: "power2.in",
  //   })
  //   .to(bgRef.current, {
  //     opacity: 0,
  //     duration: 0.3,
  //     ease: "power2.in"
  //   }, "<");

  //   // Swap Data
  //   tl.add(() => {
  //     setDisplayIndex(nextIndex);
  //   });

  //   // Reset: New items invisible
  //   tl.set(imageRef.current, { y: -800, opacity: 0, rotate: -20 });
  //   tl.set(bgRef.current, { opacity: 0 });

  //   // Enter: New assets fade/drop in
  //   tl.to(imageRef.current, {
  //     y: 0,
  //     opacity: 1,
  //     rotate: -10,
  //     duration: 0.7,
  //     ease: "back.out(1.2)",
  //   })
  //   .to(bgRef.current, {
  //     opacity: 1,
  //     duration: 0.6,
  //     ease: "power2.out"
  //   }, "-=0.4");

  // };

const handleFlavorChange = (nextIndex: number) => {
  if (nextIndex === displayIndex || isAnimating.current) return;

  isAnimating.current = true;

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating.current = false;
    }
  });

  // --- 1. EXIT ANIMATION ---
  // We slide everything out to prepare for the swap
  tl.to(imageRef.current, {
    y: 600,
    opacity: 0,
    rotate: 15,
    duration: 0.5,
    ease: "power2.in",
  })
  .to([headlineRef.current, quoteRef.current], {
    y: 200,
    opacity: 0,
    stagger: 0.05,
    duration: 0.4,
    ease: "power2.in"
  }, "<")
  .to(descRef.current, {
    opacity: 0,
    x: 30,
    duration: 0.3
  }, "-=0.2")
  .to(bgRef.current, {
    opacity: 0,
    duration: 0.4
  }, "<");

  // --- 2. DATA SWAP ---
  tl.add(() => {
    setDisplayIndex(nextIndex);
  });

  // --- 3. RESET STATE (Invisible & Repositioned) ---
  tl.set(imageRef.current, { y: -600, rotate: -15, opacity: 0 });
  tl.set([headlineRef.current, quoteRef.current], { y: 100, opacity: 0 });
  tl.set(descRef.current, { x: 30, opacity: 0 });

  // --- 4. ENTRY ANIMATION ---
  tl.to(imageRef.current, {  
    y: 0,
    opacity: 1,
    rotate: -15,
    duration: 0.8,
    ease: "back.out(1.4)",
  })
  .to([headlineRef.current, quoteRef.current], {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    duration: 0.8,
    ease: "expo.out"
  }, "-=0.5") // Start while can is still dropping
  .to(bgRef.current, {
    opacity: 1,
    duration: 0.6
  }, "-=0.6")
  .to(descRef.current, {
    opacity: 1,
    x: 0,
    duration: 0.6,
    ease: "power2.out"
  }, "-=0.4");
};

// md: 768px
  return (
    <section ref={containerRef} className='relative h-screen w-full overflow-hidden'>

      <div className='relative grid grid-cols-1 lg:grid-cols-2 w-full h-full'>
        
        {/* Left Side: Background Image */}
        <div className='hidden md:block h-full relative bg-white overflow-hidden'>
          <img 
            ref={bgRef}
            src={activeCan.bgImage} 
            className='absolute inset-0 object-top-right w-full h-full'
            alt="Background"
          />
          
          <div className='h-full w-full z-10 absolute flex items-end p-12'>
            <div className="animate-text flex items-center gap-3 text-black font-bold text-md uppercase [writing-mode:vertical-lr] rotate-180">
              <div className="h-20 w-[4px] bg-black" />
              Scroll Down
            </div>
          </div>
        </div>

        {/* Right Side: Content Area */}
        {/* <div className={`h-full relative transition-colors duration-700 bg-radial-[at_left] from-white/20 to-${activeCan.color}`}>
          <div className="absolute inset-0 flex flex-col px-8 md:px-20 z-10 justify-center">
            <div>
              <p className="animate-text uppercase text-[clamp(1rem,3vw,20px)] font-medium text-[#1f2028] mb-2">
                {activeCan.quote}
              </p>
              <h1 className="animate-text text-[clamp(50px,12vw,150px)] leading-[0.8] tracking-wider text-white uppercase font-black [text-shadow:0_4px_20px_rgba(0,0,0,0.2)]">
                {activeCan.headling}
              </h1>
            </div>
            <p className="animate-text max-w-md mt-6 text-black/70 font-medium leading-relaxed">
              {activeCan.description}
            </p>
          </div>
        </div> */}


          
          <div className={`h-full relative transition-colors duration-500 bg-radial-[at_left] from-mist-100 to-[${activeCan.color}] justift-center items-center`}>
  
            <div className="absolute right-0 w-full md:w-[90%] h-full flex flex-col md:justify-center md:px-12 px-4 z-10">

              {/* Top/Center Section */}
              <div className="overflow-hidden place-self-center md:mt-0 md:ml-0 mt-auto w-full"> {/* Added mt-auto here if you want the headline pushed down too, or keep it as is */}
                <p ref={quoteRef} className="uppercase text-[clamp(1rem,4vw,24px)] max-w-[15ch] font-medium leading-tight text-[#1f2028] ml-8 md:ml-20 ">
                  {activeCan.quote}
                </p>
                <h1 ref={headlineRef} className="relative text-[clamp(80px,10vw,180px)] leading-[0.8] tracking-wider text-white [text-shadow:0_0_12px_rgba(255,255,255,0.6),0_4px_16px_rgba(0,0,0,0.3)] uppercase font-display font-extrabold">
                  {activeCan.headling}
                </h1>
              </div>

              {/* Bottom Section */}
              <p 
                ref={descRef} 
                className="md:max-w-md min-h-40 text-black/80 font-medium tracking-wide leading-relaxed text-justify md:mt-0 mt-auto md:place-self-end mb-20"
              >
                {activeCan.description}
              </p>
                  
            </div>
          </div>

      </div>
      
      {/* Floating Center Can */}


        <img 
          ref={imageRef}
          src={activeCan.img} 
          alt={activeCan.headling}
          className='absolute inset-0 m-auto -rotate-10 md:z-30 h-[50%] md:h-[75%] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)] select-none pointer-events-none'
        />


      {/* Flavor Picker */}
      <div className="animate-text absolute md:bottom-10 bottom-5 left-1/2 -translate-x-1/2 lg:left-auto lg:right-10 lg:translate-x-0 z-40 flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
        <span className="hidden md:block text-xs font-bold uppercase tracking-widest px-2 text-white">Flavors</span>
        {BEVERAGE_CONFIG.map((can, i) => (
          <button 
            key={i} 
            onClick={() => handleFlavorChange(i)}
            className={`group relative w-12 h-12 md:w-14 md:h-14 transition-all rounded-full flex items-center justify-center ${
              i === displayIndex ? "bg-white scale-110 shadow-xl" : "bg-white/30 hover:bg-white/50 cursor-pointer"
            }`}
          >
            <img 
              src={can.img}
              className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform" 
              alt={can.headling}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;

