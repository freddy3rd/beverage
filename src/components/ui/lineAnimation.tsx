import React from 'react';

interface CyberpunkCardProps {
  label?: string;
  description?: string;
  accentColor?: string; // e.g., "#ff3c00"
  className?: string;
}

const CyberpunkCard: React.FC<CyberpunkCardProps> = ({
  label = "// 01 · peak signal",
  description = "Maximum output detected at node 310. Threshold exceeded by 34%.",
  accentColor = "#ff3c00",
  className = "",
}) => {
  // We use inline styles for the accent color to make it truly reusable
  const rgbaAccent = (opacity: number) => {
    // Simple hex to rgba conversion for the dynamic accent
    const r = parseInt(accentColor.slice(1, 3), 16);
    const g = parseInt(accentColor.slice(3, 5), 16);
    const b = parseInt(accentColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div className={`cyber-wrap ${className}`}>
      <style>{`
        .cyber-wrap {
          position: relative;
          width: 100%;
          max-width: 680px;
          height: 280px;
          background: #0a0a0a;
          margin: 0 auto;
          clip-path: polygon(0 0, 100% 0, 100% 88%, 96% 100%, 0 100%);
          overflow: hidden;
          cursor: crosshair;
        }

        .cyber-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.015) 2px,
            rgba(255,255,255,0.015) 4px
          );
          pointer-events: none;
          z-index: 2;
        }

        .cyber-corner-tl {
          position: absolute;
          top: 0; left: 0;
          width: 20px; height: 20px;
          border-top: 1px solid ${rgbaAccent(0.7)};
          border-left: 1px solid ${rgbaAccent(0.7)};
          z-index: 5;
        }

        .cyber-corner-br {
          position: absolute;
          bottom: 28px; right: 0;
          width: 20px; height: 20px;
          border-bottom: 1px solid ${rgbaAccent(0.7)};
          border-right: 1px solid ${rgbaAccent(0.7)};
          z-index: 5;
        }

        .runner {
          stroke-dasharray: 700;
          stroke-dashoffset: 700;
          transition: stroke-dashoffset 0s;
        }
        .runner-ghost {
          stroke-dasharray: 700;
          stroke-dashoffset: 700;
          transition: stroke-dashoffset 0s;
        }

        .cyber-wrap:hover .runner {
          stroke-dashoffset: 0;
          transition: stroke-dashoffset 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cyber-wrap:hover .runner-ghost {
          stroke-dashoffset: 0;
          transition: stroke-dashoffset 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.03s;
        }

        .origin-sq { opacity: 0; transition: opacity 0.2s; }
        .cyber-wrap:hover .origin-sq { opacity: 1; animation: cyber-flicker 0.9s ease-in-out infinite; }

        .tick { opacity: 0; transition: opacity 0.15s 0.45s; }
        .cyber-wrap:hover .tick { opacity: 0.5; }

        .arrival-sq { opacity: 0; }
        .cyber-wrap:hover .arrival-sq { animation: arrivalFlash 0.4s ease-out 0.52s forwards; }

        @keyframes cyber-flicker {
          0%,100%{opacity:1} 40%{opacity:0.5} 70%{opacity:0.85}
        }
        @keyframes arrivalFlash {
          0% { opacity:0; }
          30% { opacity:1; }
          100%{ opacity:1; }
        }

        .can-description {
          position: absolute;
          z-index: 10;
          right: 32px;
          top: 28px;
          background: ${rgbaAccent(0.06)};
          border: 1px solid ${rgbaAccent(0.5)};
          clip-path: polygon(0 0, 100% 0, 100% 72%, 86% 100%, 0 100%);
          padding: 12px 16px 20px 14px;
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.25s 0.5s, transform 0.25s 0.5s;
          pointer-events: none;
          max-width: 165px;
          font-family: 'Share Tech Mono', monospace;
        }

        .cyber-wrap:hover .can-description {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      <div className="cyber-corner-tl" />
      <div className="cyber-corner-br" />

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 620 240"
        fill="none"
      >
        <defs>
          <filter id="glow-hot">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <polyline
          className="runner-ghost"
          points="80,180 200,180 380,58 548,58"
          stroke={rgbaAccent(0.2)}
          strokeWidth="9"
          strokeLinejoin="miter"
          strokeLinecap="square"
        />

        <polyline
          className="runner"
          points="80,180 200,180 380,58 548,58"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinejoin="miter"
          strokeLinecap="square"
          filter="url(#glow-hot)"
        />

        {/* Ticks & Crosshair */}
        <line className="tick" x1="200" y1="173" x2="200" y2="187" stroke={accentColor} strokeWidth="1" />
        <line className="tick" x1="380" y1="51" x2="380" y2="65" stroke={accentColor} strokeWidth="1" />
        <line className="tick" x1="71" y1="180" x2="85" y2="180" stroke={accentColor} strokeWidth="0.8" />
        <line className="tick" x1="80" y1="172" x2="80" y2="188" stroke={accentColor} strokeWidth="0.8" />

        <rect className="origin-sq" x="77" y="177" width="6" height="6" fill={accentColor} filter="url(#glow-hot)" />
        <rect className="arrival-sq" x="545" y="55" width="6" height="6" fill={accentColor} filter="url(#glow-hot)" />

        <text x="88" y="196" fontFamily="'Share Tech Mono', monospace" fontSize="9" fill="rgba(255,255,255,0.2)" letterSpacing="0.08em">ORIGIN</text>
        <text x="556" y="70" fontFamily="'Share Tech Mono', monospace" fontSize="9" fill={rgbaAccent(0.5)} letterSpacing="0.08em">→</text>
      </svg>

      <div className="can-description">
        <div 
          style={{ fontSize: '9px', letterSpacing: '0.15em', color: rgbaAccent(0.7), textTransform: 'uppercase', marginBottom: '6px' }}
        >
          {label}
        </div>
        <p style={{ fontSize: '11px', lineHeight: '1.65', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
          {description}
        </p>
        <div 
          style={{ position: 'absolute', top: 0, left: 0, width: '2px', height: '100%', background: rgbaAccent(0.85) }} 
        />
      </div>
    </div>
  );
};

export default CyberpunkCard;