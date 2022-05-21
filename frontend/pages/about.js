import Head from "next/head";
import GoBack from "../components/goBack";
import { useEffect, useRef, useState } from 'react';
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";
import Footer from "../components/footer";
import ViewSourceCode from "../components/viewSourceCode";
  
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
        <div class="homepage-about">
          <large><b>ABOUT</b></large>
          <div class="homepage-sub">
            <p><u>ZKDrop</u> is a private lottery airdrop system that allows users to retrieve airdrops in a privacy preserving manner. 
            Users can verify their eligibility to collect an airdrop without associating their public wallet and doxxing their
            fincial history. The user will calculate a commitment based on hashing a key/secret pair of sha256 hashes, and upload the commitment to github gist. 
            The commitment serves as the user's public ID. 
            Once the smart contract is deployed, it will randomly select 50% of the commitments in the pool as winners.
            Using the correct key/secret pair used to generate that commitment, users can withdraw the airdrop
            to any wallet of their choosing.
            </p>
          </div>
        </div>
        <div className="mb-10">
          <GoBack />
        </div>
        <div>
            <Footer />
        </div>
        <div>
            <ViewSourceCode />
        </div>
      </section>
    </main>
  )
}