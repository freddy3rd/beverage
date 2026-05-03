declare global {
    interface Description {
    text: string;
    x: string;
    y: string;
}

interface ImageOverlay {
    time: number;
    src: string;
    title: string;
    description: Description;
    
    }

    interface BeverageRefs {
        cokeRef: React.RefObject<HTMLDivElement | null>;
        pepsiRef: React.RefObject<HTMLDivElement | null>;
        fantaRef: React.RefObject<HTMLDivElement | null>;
        spriteRef: React.RefObject<HTMLDivElement | null>;
    }

    interface CanConfig {
        img:string;
        color: string;
        bgImage: string;
        headling: string;
        quote: string;
        description : string;
    }

interface SensorySection {
  title: string;
  label: string;
  description: string;
}

interface pallete {
  textColor: string,
  bgGradient:string,
  textShadow: string,
}


interface BeverageConfig extends CanConfig {
    // Original fields
    img: string;
    
    color: string;
    gradient: string;
    hexPreview: string;

    bgImage: string;
    headling: string; // Keeping your original spelling
    quote: string;
    description: string;

    // New Bento-specific fields
    carbonation: {
      label: string;
      intensity: string;
    };
    thermal: {
      label: string;
      temp: string;
      description: string;
    };
    sensory: SensorySection & {
      tags: string[];
    };
    ritual: {
      title: string;
      description: string;
      image: string;
    };
  }


}
export {}