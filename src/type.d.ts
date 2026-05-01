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
}
export {}