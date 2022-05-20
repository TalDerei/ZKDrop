import Head from "next/head";
import GoBack from "../components/goBack";
import { useEffect, useRef, useState } from 'react';
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";

// export default function About() {
//     return (
//       <section class="general">
//         <div>
//         <Head>
//           <title>zkGames - About</title>
//           <meta name="title" content="zkGames - About" />
//           <meta
//             name="description"
//             content="Zero Knowledge Games Platform - About"
//           />
//         </Head>
//         <div className="mb-10">
//           <GoBack />
//         </div>
//         <div className="grid place-items-center">
//           <div className="flex justify-center items-center mb-10 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
//             zkGames
//           </div>
//           <div className="flex justify-center items-center text-lg md:w-96 w-auto text-slate-300">
//             zkGames is a platform that allows users to play zk (zero knowledge)
//             games and mint an NFT as proof that they have won.
//           </div>
//         </div>
//       </div>
//       </section>

//     );
//   }
  
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
      {/* <div>
        <Home/>
      </div> */}

      <section class="general">
        <div class="homepage">
            <large><u>ABOUT</u></large>
          <br></br>
          <br></br>
          <div class="homepag-sub">
            <small>kdmnksd</small>
          </div>
        </div>
      </section>
    </main>
  )
}