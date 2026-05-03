import { useLayoutEffect, useRef} from 'react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

type TagGroup = {
  tags: string[];
  color: string;
};

const ExplodedSensorTags = ({ tags, color}: TagGroup) => {
//   const containerRef = useRef(null);
  
  // CONFIGURATION: Adjust these to push elements further out
//   const runnerX = "50%"; 
//   const lineStartOffset = 180; // Distance from center where the line STARTS
//   const lineWidth = 140;       // Length of the connecting line
//   const verticalGap = 80;      // Vertical breathing room

//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
//       // Draw lines outward
//       gsap.from(".anchor-line", {
//         drawSVG: 0,
//         duration: 1.4,
//         stagger: 0.1,
//         ease: "power4.out",
//       });

//       // Tags slide in from the edges
//       gsap.from(".tag-box", {
//         opacity: 0,
//         x: (i) => (i % 2 === 0 ? -40 : 40),
//         duration: 1.2,
//         stagger: 0.1,
//         delay: 0.5,
//         ease: "expo.out",
//       });
//     }, containerRef);

//     return () => ctx.revert();
//   }, [tags]);

  const containerRef = useRef(null);
//   const svgRef = useRef(null);
  
  // Layout Constants
  const lineStartOffset = 80; 
  const lineWidth = 80;       
  const verticalGap = 100;      

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 10%",    // Starts when the top of container hits 60% of viewport
          end: "bottom 20%",   // Ends when bottom hits 20%
          toggleActions: "play reverse play reverse",           // Smoothly ties animation to scroll progress
          // markers: true,     // Uncomment this to debug the trigger points
        }
      });

      // 1. Animate the center runner line (if you have one)
      tl.from(".center-runner", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.8,
        ease: "none"
      }, 0);

      // 2. Animate the anchor lines drawing outward
      tl.from(".anchor-line", {
        drawSVG: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.inOut",
      }, 0.2);

      // 3. Reveal the tags
      tl.from(".tag-box", {
        opacity: 0,
        x: (i) => (i % 2 === 0 ? -30 : 30),
        stagger: 0.2,
        duration: 0.6,
        ease: "power4.out",
      }, 0.5);

    }, containerRef);

    return () => ctx.revert();
  }, [tags]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-100">
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        {tags.map((data, index) => {
          const isLeft = index % 2 === 0;
          
          // Vertical positioning
          const totalHeight = (tags.length - 1) * verticalGap;
          const yOffset = (index * verticalGap) - (totalHeight / 2);
          const currentY = `calc(50% + ${yOffset}px)`;

          // Horizontal Logic for "Away from Center"
          // x1 = Point closest to the center object
          // x2 = Point furthest from center (where the tag sits)
          const x1 = isLeft 
            ? `calc(50% - ${lineStartOffset}px)` 
            : `calc(50% + ${lineStartOffset}px)`;
          
          const x2 = isLeft 
            ? `calc(50% - ${lineStartOffset + lineWidth}px)` 
            : `calc(50% + ${lineStartOffset + lineWidth}px)`;

          return (
            <g key={index} className="overflow-visible">
              <line
                style={{ "--stroke-color": color} as React.CSSProperties }
                className="anchor-line stroke-black"
                x1={x1}
                y1={currentY}
                x2={x2}
                y2={currentY}
                strokeWidth="1"
                fill="none"
              />
              
              <foreignObject
                // Position tag at the end of the line (x2)
                // Left tags need an extra offset to the left so they don't overlap the line
                x={isLeft ? `calc(50% - ${lineStartOffset + lineWidth + 120}px)` : x2}
                y={`calc(50% + ${yOffset}px - 15px)`}
                width="120"
                height="30"
                className="overflow-visible"
              >
                <div className={`tag-box flex h-full items-center ${isLeft ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-center gap-2 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                    <span 
                    style={{ "--bg-color": color} as React.CSSProperties }
                    className="whitespace-nowrap px-3 py-1 bg-(--bg-color) backdrop-blur-xl border border-white/10 text-[10px] text-white uppercase tracking-[0.25em] rounded-full">
                      {data}
                    </span>
                    {/* Visual Anchor Dot at the end of the line */}
                    <div className="w-1 h-1 bg-white/80 rounded-full shadow-[0_0_5px_white]" />
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ExplodedSensorTags;