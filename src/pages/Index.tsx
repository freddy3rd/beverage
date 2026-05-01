
import { useRef } from "react"
import AboutSection from "./components/About_v1"

import HeroSection from "./components/Hero"
import Navbar from "@/components/layout/Header"
// import TravelingCan from "./components/TravelingCan"



function Index() {
  // const cokeRef = useRef<HTMLDivElement>(null);
  // const pepsiRef = useRef<HTMLDivElement>(null);
  // const fantaRef = useRef<HTMLDivElement>(null);
  // const spriteRef = useRef<HTMLDivElement>(null);

  // const beverageRefs: BeverageRefs = {
  //   cokeRef,
  //   pepsiRef,
  //   fantaRef,
  //   spriteRef,
  // };

  return (
    <>
      <Navbar/>
      <HeroSection />

    </>
  )
}

export default Index


