import Head from "next/head";
import { useEffect, useRef, useState } from 'react';
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";
import Form from "../../components/form";
import { pedersenHashConcat, toHex } from '../../zkp-merkle-airdrop-libs/lib';
import sjcl from 'sjcl'
var uuid = require("uuid");
import Gist from "../../components/gist";

export default function About() {
    const [state, setState] = useState ({
        key: "",
        secret: "",
        commitment: "",
    });

    let renderConstructKey = () => {
        constructKey();
    }

    let renderConstructSecret = () => {
        constructSecret();
    }

    let renderConstructCommitment = () => {
        constructCommitment();
    }

    async function constructKey() {
        console.log("key is: " + state.key)
        var myString = uuid.v4();
        const myBitArray = sjcl.hash.sha256.hash(myString)
        const myHash = sjcl.codec.hex.fromBits(myBitArray)
        state.key = toHex(myHash);
        console.log(state.key)
        setState({...state})
    }

    async function constructSecret() {
        console.log("key is: " + state.key)
        var myString = uuid.v4();
        const myBitArray = sjcl.hash.sha256.hash(myString)
        const myHash = sjcl.codec.hex.fromBits(myBitArray)
        state.secret = toHex(myHash);
        console.log(state.secret)
        setState({...state})
    }

    async function constructCommitment() {
        console.log("key is: " + state.key)
        console.log("secret is: " + state.secret)
    
        if (state.key === '' || state.secret === '')  {
            alert("Either key or secret are missing!")
            return
        }

        state.commitment = toHex(pedersenHashConcat(BigInt(state.key), BigInt(state.secret)));
        console.log("commitment is: " + state.commitment);

        setState({...state})
    }

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
          backgroundColor: 0x6b6b82,
          maxDistance: 13.00
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
        <br></br>
        <br></br>
        <div class="wager">
            <large>ENTER LOTTERY</large>
          <br></br>
          <br></br>
          <div class="homepag-sub">
            {/* <small>kdmnksd</small> */}
          </div>
          <button class="button button1 key" onClick={renderConstructKey}>Generate Key</button>
          <br></br>
          <button class="button button2 secret" onClick={renderConstructSecret}>Generate Secret</button>   
          <br></br>
          <button class="button button1 commitment" onClick={renderConstructCommitment}>Calculate Commitment</button>
        </div>
          <div class="card-key">
            <div class="card-header">
              <b>Key:</b>
            </div>
            <div class="card-body">
              {state.key === ''?
                <div>
                </div> :
                <div>
                  {state.key}
                </div>
              }
            </div>
          </div>
          <div class="card-secret">
            <div class="card-header">
              <b>Secret:</b>
            </div>
            <div class="card-body">
              {state.secret === ''?
                <div>
                </div> 
              :
                <div>
                  {state.secret}
                </div>
              }
            </div>
          </div>
          <div class="card-commitment">
            <div class="card-header">
            <b>Commitment:</b>
            </div>
            <div class="card-body">
              {state.commitment === ''?
                <div>
                </div> 
              :
                <div>
                  {state.commitment}
                </div>
              }
            </div>
          </div>
          <div>
            <Gist/>
            <br></br>
            <br></br>
          </div>
          <div>
        </div>
      </section>
      
    </main>
  )
}