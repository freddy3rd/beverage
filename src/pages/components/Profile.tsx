
// import { useRef } from 'react';
// import gsap from 'gsap';
// import { useGSAP } from '@gsap/react';
import { BEVERAGE_CONFIG } from '@/constants/Data';

// We use your BeverageConfig interface from the previous step
type Props = {
  index: number;

};

const BeverageBento = ({ index}: Props) => {
  // const containerRef = useRef<HTMLDivElement>(null);
  const data = BEVERAGE_CONFIG[index];
  console.log(data)


  return (
    <section className="w-full h-screen ">
      <div className="w-full h-full grid grid-cols-3 max-w-350 m-auto">
        <div className="w-full h-full border">
        
        </div>

        <div  className="w-full h-full border place-content-center">
          <div className='border border-amber-400 w-200 h-200' id="beverage_landing">

          </div>

        </div>

        <div className="w-full h-full border">2</div>
      </div>
    </section>
  
  );
};

export default BeverageBento;
