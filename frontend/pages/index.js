import Home from "../components/homepage";
import { useEffect, useRef, useState } from 'react';
import GLOBE from "vanta/dist/vanta.globe.min";
import * as THREE from "three";
import Footer from "../components/footer";
import ViewSourceCode from "../components/viewSourceCode";

export default function Page() {
  const [vantaEffect, setVantaEffect] = useState(0);
  const vantaRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        GLOBE({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 500.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x463131,
          backgroundColor: 0x6b6b82
        })
      )
    }
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy()
      }
    }
  }, [vantaEffect])

  return (
    <main ref={vantaRef}>
      <section class="general">
        <div class="homepage">
            <large><u>ZKDrop</u></large>
          <br></br>
          <br></br>
          <div class="homepag-sub">
            <small>A Private Lottery Airdrop System</small>
          </div>
        </div>
      </section>
      <div>
        <Footer />
      </div>
      <div>
        <ViewSourceCode />
      </div>
      <div>
        <Home/>
      </div>
    </main>
  )
}
