import Head from "next/head";
import GoBack from "../components/goBack";
import { useEffect, useRef, useState } from 'react';
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";
  
export default function About() {
  const [vantaEffect, setVantaEffect] = useState(0);
  const vantaRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
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
          <large><u>ABOUT</u></large>
          <div class="homepag-sub">
            <small>ZKDrop is a private airdrop system that allows users to retrieve airdrops in a privacy preserving manner.
            Users can verify their eligibility to retrieve an airdrop without associating their public wallet. The user will
            calculate a commitment based on hashing a secret and key pair, and upload that to github gist. At a later specified date,
            the contract will be deployed, will choose 50% of the commitments as winners, and allow users to retrieve their airdrop
            to any wallet if they input the correct key/secret pair used to generate that commitment. 
            </small>
          </div>
        </div>
        <div className="mb-10">
          <GoBack />
        </div>
      </section>
    </main>
  )
}