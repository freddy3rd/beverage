import { useEffect, useRef, useState } from "react";
import { BEVERAGE_CONFIG } from "@/constants/Data";
import { useGSAP } from "@gsap/react";
// import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ExplodedSensorTags from "@/components/ui/tagsAnimation";
import { Bubbles, Thermometer, CupSoda} from "lucide-react";
import { images } from "@/constants/Image";

gsap. registerPlugin(Flip, ScrollTrigger)

const Hero = () => {
  const [displayIndex, setDisplayIndex] = useState(0);
  const activeCan = BEVERAGE_CONFIG[displayIndex];

  const imageRef = useRef<HTMLImageElement>(null);
  
  const secondContainerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const secondSection = useRef<HTMLDivElement>(null);
  const bgOverlay = useRef<HTMLDivElement>(null);

  const contentParentRef = useRef<HTMLDivElement>(null);
 

  const isAnimating = useRef(false);

  const secondheadlineRef = useRef<any>(null)
  const headlineRef = useRef<any>(null)
  const quoteRef = useRef<any>(null)
  const descRef = useRef<any>(null)

 useGSAP(() => {
    if (!headlineRef.current || !imageRef.current) return;

    console.log("imageRef", imageRef.current)
    const tl = gsap.timeline();
    
    // Create SplitText
    // const split = new SplitText(headlineRef.current, { type: "chars" });
    // const splitQuote = new SplitText(quoteRef.current, { type: "words" });
    

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
    // .from(split.chars, {
    //   y: 200,
    //   // opacity: 0,
    //   // rotateX: -90, // Adds a 3D flip effect
    //   autoAlpha: 0,
    //   stagger: 0.08, // Fast stagger
    //   duration: 1,
    //   ease: "expo.out",
    // }, "-=0.3")
    // .from(splitQuote.words, {
    //   y: 60,
    //   opacity: 0,
    //   // rotateX: -90, // Adds a 3D flip effect
    //   autoAlpha: 0,
    //   stagger: 0.08, // Fast stagger
    //   duration: 1,
    //   ease: "expo.out",
    // }, "-=0.2")
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



    // return () => split.revert();
  }, { scope: containerRef });
  


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
  .from(
  overlayRef.current,
  { opacity: 0, duration: 0.6, ease: "power2.out" },
  "-=0.8"
)
  .to([headlineRef.current, quoteRef.current], {
    y: 200,
    opacity: 0,
    stagger: 0.05,
    duration: 0.8,
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

useEffect(() =>{

      if(imageRef. current){

        gsap.timeline({
          scrollTrigger:{ 
            trigger: containerRef.current,
            start: "top top",
            scrub: 1,
            snap: 1,
            invalidateOnRefresh: true,
            // markers: true
            
          }
        })
        .add(Flip.fit(imageRef.current, secondContainerRef.current, {scale: true, absolute: true, duration: 1, ease: 'none' }) as gsap.core.Tween);
      }

    gsap.timeline({
      scrollTrigger: {
          trigger: secondSection.current,
          start: "top 80%",
          invalidateOnRefresh: true,
          toggleActions: "play none none reverse", // optional but useful
        }
      })
      .fromTo(
        bgOverlay.current,
        { height: 0,


        },
        {

          height: "100%",
          duration: 0.8,
         ease: "power4.inOut",
        }
      );


      

})

useGSAP(() => {
  // 1. Grab the elements inside the hook to ensure they exist in the DOM
  const elements = gsap.utils.toArray('.dataRef');
  console.log("element", elements)

  if (elements.length === 0 || !contentParentRef.current) return;

  gsap.timeline({
    scrollTrigger: {
      trigger: contentParentRef.current,
      start: "top 20%", // Changed to 80% so you see it enter from the bottom
      toggleActions: "play reverse play reverse",
      // markers: true, 
    },
  })
  .from(secondheadlineRef.current,{
    y:100,
    ease: "power4.out",
    duration: 1.2,
  })
  .from(elements, {
    x: -40,
    opacity: 0,
    ease: "power4.out",
    duration: 0.8,
    // stagger: 0.2,
  });
}, { scope: secondSection});

// md: 768px
  return (
    <>
    <section ref={containerRef} className='relative h-screen w-full '>

      <div className='relative grid grid-cols-1 lg:grid-cols-2 w-full h-full'>
        
        {/* Left Side: Background Image */}
        <div className='hidden md:block h-full relative bg-white overflow-hidden'>
          <img 
            ref={bgRef}
            src={activeCan.bgImage} 
            className='absolute inset-0 object-top-right w-full h-full'
            alt="Background"
          />
          <div
              ref={overlayRef}
              className="absolute inset-0 z-[1]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
              }}
            />
          
          <div className='h-full w-full z-10 absolute flex items-end p-12 ml'>
            <div className="animate-text flex items-center gap-3 text-white font-bold text-md uppercase [writing-mode:vertical-lr] rotate-180">
              <div className="h-20 w-[4px] bg-white" />
              Scroll Down
            </div>
          </div>
        </div>
 
          <div 
            style={{ "--target-color": activeCan.color } as React.CSSProperties}
            // className={`h-full relative transition-colors duration-500 bg-radial-[at_left] from-mist-100 to-(--target-color) justift-center items-center`}>
            className={`h-full relative transition-colors duration-500 ${activeCan.gradient} justift-center items-center`}>
  
            <div className="absolute right-0 w-full md:w-[90%] h-full flex flex-col md:justify-center md:px-12 px-4 z-10">

              {/* Top/Center Section */}
              <div className="overflow-hidden place-self-center md:mt-0 md:ml-0 mt-auto w-full"> {/* Added mt-auto here if you want the headline pushed down too, or keep it as is */}
                <p ref={quoteRef} 
                  style={{ "--quote-color": activeCan.color } as React.CSSProperties}
                  className="uppercase text-[clamp(1rem,4vw,24px)] max-w-[30ch] font-bold leading-tight text-(--quote-color) text-headling ml-8 md:ml-20 ">
                  {activeCan.quote}
                </p>
                {/* <h1 ref={headlineRef} className="relative text-[clamp(80px,10vw,180px)] leading-[0.8] tracking-wider text-white [text-shadow:0_0_12px_rgba(255,255,255,0.6),0_4px_16px_rgba(0,0,0,0.3)] uppercase font-display font-extrabold"> */}
                <h1
                  ref={headlineRef}
                  className="relative leading-[0.82] tracking-tight uppercase font-black text-title py-2"
                  style={{
                    fontSize: "clamp(72px, 10vw, 168px)",
                    color: "white",
                    
                    fontStyle: "italic",
                  }}
                >  
                  {activeCan.headling}
                </h1>
              </div>

              {/* Bottom Section */}
              <p 
                ref={descRef} 
                
                className="md:max-w-md min-h-40 text-white font-medium tracking-wide leading-relaxed text-justify md:mt-0 mt-auto md:place-self-end mb-20"
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
      <div className=" absolute md:bottom-10 bottom-5 left-1/2 -translate-x-1/2 lg:left-auto lg:right-10 lg:translate-x-0 z-40 flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
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

      <div ref={secondSection} className="w-full relative">
        <div
          ref={bgOverlay}
          className={`absolute inset-0 w-full h-full ${activeCan.gradient} `} />
          
        <div
          className="absolute inset-0 flex items-center justify-center w-full h-full opacity-5 tracking-wider uppercase font-black text-title py-2 border border-amber-300"
          style={{
            fontSize: "clamp(400px, 10vw, 440px)",
            color: "white",
            fontStyle: "italic",
            textAlign: "center", // Ensures multi-line text is also centered
          }}
        >  
          {activeCan.headling}
        </div>

        <div className="absolute inset-0 h-full w-full ">
            <img src={images.water_splash} className="absolute inset-0 object-contain w-full h-full opacity-80"/>
        </div>
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 max-w-350 m-auto py-20" id="productContainer">

          <div className="relative w-full h-full">
            <div className="gap-8 h-full flex flex-col justify-center">
              
              <div className="overflow-y-hidden">
                 <h1
                  ref={secondheadlineRef}
                  className="relative leading-[0.82] tracking-tight uppercase font-black text-title"
                  style={{
                    fontSize: "clamp(80px, 10vw, 140px)",
                    color: "white",
                    fontStyle: "italic",
                  }}
                >  
                  {activeCan.headling}
                </h1>
              </div>



                <div
                  style={
                    {
                      "--border-color": activeCan.color,
                      "--hex-color": activeCan.hexPreview,
                    } as React.CSSProperties
                  }
                  data-quote={activeCan.quote}
                  className={`dataRef relative tracking-wide leading-relaxed p-4 pt-6 rounded-2xl backdrop-blur-xl shadow-2xl 
                  ${
                    activeCan.headling !== "FANTA"
                      ? "text-white border border-(--border-color) bg-(--hex-color)/80"
                      : "text-(--border-color) bg-[#fef9f1]"
                  }
                  before:content-[attr(data-quote)]
                  before:z-1
                  before:w-max
                  before:h-max
                  ${activeCan.headling !== "FANTA"? 'before:bg-(--hex-color) before:border before:border-(--border-color)' : 'before:bg-[#fef9f1]'}
                  before:px-3
                  before:rounded-lg
                  
                  before:absolute
                  before:-top-4 
                  before:inset-y-0
                  before:text-md before:tracking-widest before:uppercase
                  before:pointer-events-none
                  before:font-bold
                `}
                >
                  {activeCan.description}
                </div>
            </div>
          </div>

          <div  className="relative w-full h-screen place-content-center ">


        
            <div  className='relative w-full h-full p-8 flex justify-end items-center '>

           
                <div ref={secondContainerRef} className="w-full h-200" />

                <div
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-6 rounded-full blur-2xl pointer-events-none"
                  style={{ background: activeCan.color, opacity: 0.35 }}
                />
                <ExplodedSensorTags tags={activeCan.sensory.tags} color={activeCan.color}/>
            </div>

          </div>

          <div ref={contentParentRef} className='w-full h-full'>
            <div className="p-4 h-full flex flex-col justify-center gap-4">
              <div 

                style={{ "--border-color": activeCan.color, "--hex-color": activeCan.hexPreview} as React.CSSProperties}
                className={`dataRef flex items-center gap-3 p-4 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden
                    ${activeCan.headling !== "FANTA" ?
                    'text-white  border border-(--border-color) bg-(--hex-color)/80' : 'text-(--border-color) bg-[#fef9f1]'
                  }
                
                `}
              >
                {/* Icon Container */}
                <div className={`flex place-self-start items-center justify-center p-3 rounded-full ${activeCan.headling !== "FANTA" ? 'bg-white/10 border border-(--border-color)' : 'bg-[#fc7401]'} border border-(--bg-color) text-white font-bold shadow-inner`}>
                  <Bubbles color="white" size={24}/>
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest font-medium leading-none mb-1 opacity-50">
                    {activeCan.carbonation.label}
                  </span>
                  <span className="text-2xl font-bold leading-none py-2">
                    {activeCan.carbonation.intensity}
                  </span>
                </div>
              </div>

              <div 

                style={{ "--border-color": activeCan.color, "--hex-color": activeCan.hexPreview} as React.CSSProperties}
                className={`dataRef flex items-center gap-3 p-4 rounded-2xl  backdrop-blur-xl shadow-2xl overflow-hidden 
                  ${activeCan.headling !== "FANTA" ?
                    // 'text-white  border border-(--bg-color) ${activeCan.gradient}' : 'text-(--bg-color) bg-[#fef9f1]'
                    'text-white  border border-(--border-color) bg-(--hex-color)/80' : 'text-(--border-color) bg-[#fef9f1]'
                  }
                  `}
              >
                {/* Icon Container */}
                <div className={`flex place-self-start items-center justify-center p-3 rounded-full  ${activeCan.headling !== "FANTA" ? 'bg-white/10  border border-(--border-color)' : 'bg-[#fc7401]'}  text-white font-bold shadow-inner`}>
                  <Thermometer color="white" size={24}/>
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest  font-medium leading-none mb-1 opacity-50">
                    {activeCan.thermal.label}
                  </span>
                  <span className="text-2xl font-bold leading-none py-2">
                    {activeCan.thermal.temp}
                  </span>
                  <p >
                    {activeCan.thermal.description}
                </p>
                </div>
              </div>
              
              <div

                style={{ "--border-color": activeCan.color, "--hex-color": activeCan.hexPreview} as React.CSSProperties}
                className={`dataRef relative flex flex-col items-center gap-3 p-4 rounded-2xl  backdrop-blur-xl shadow-2xl overflow-hidden 
                  ${activeCan.headling !== "FANTA" ?
                    // 'text-white  border border-(--bg-color) ${activeCan.gradient}' : 'text-(--bg-color) bg-[#fef9f1]'
                    'text-white  border border-(--border-color) bg-(--hex-color)/80' : 'text-(--border-color) bg-[#fef9f1]'
                  }
                  `}
              >
                {/* Icon Container */}
                <div className="flex justify-center items-center place-self-start gap-3">
                  <div className={`flex place-self-start items-center justify-center p-3 rounded-full  ${activeCan.headling !== "FANTA" ? 'bg-white/10  border border-(--border-color)' : 'bg-[#fc7401]'}  text-white font-bold shadow-inner`}>
                    <CupSoda color="white" size={24}/>
                  </div>
                  <span className="text-xs uppercase tracking-widest  font-medium leading-none mb-1 opacity-50">
                    {activeCan.ritual.title}
                  </span>
                 

                </div>

                  <p className="max-w-[35ch] place-self-start px-6 font-light">
                      {activeCan.ritual.description}
                  </p>
                  <img src={activeCan.ritual.image} className="absolute -bottom-20 right-0 h-65 w-40"/>
              </div>

            </div>

          </div>
        </div>

        
      </div>

    </>
  );
};

export default Hero;

