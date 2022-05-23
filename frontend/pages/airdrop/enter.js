import Head from "next/head";
import { useEffect, useRef, useState } from 'react';
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";
import { pedersenHashConcat, toHex, toBigIntLE } from '../../zkp-merkle-airdrop-libs/lib';
import Gist from "../../components/gist";
import GoBack from "../../components/goBack";
var uuid = require("uuid");
import Link from "next/link";
import Footer from "../../components/footer";
import ViewSourceCode from "../../components/viewSourceCode";
// import {toBigIntLE} from "../../../utils/util"
let cryptos = require('crypto-browserify')

export default function Enter() {
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
        let bytes = cryptos.randomBytes(31)
        console.log("bytes is: ", bytes);
        let bytesBigInt = toBigIntLE(bytes);
        console.log("bytesBigInt is: ", bytesBigInt);
        let bytesHex = toHex(bytesBigInt);
        console.log("bytesHex is: ", bytesHex);
        state.key = bytesHex

        console.log("key is: ", state.key);
        setState({...state, key: state.key})
    }

    async function constructSecret() {
        let bytes = cryptos.randomBytes(31)
        console.log("bytes is: ", bytes);
        let bytesBigInt = toBigIntLE(bytes);
        console.log("bytesBigInt is: ", bytesBigInt);
        let bytesHex = toHex(bytesBigInt);
        console.log("bytesHex is: ", bytesHex);
        state.secret = bytesHex

        console.log("secret is: ", state.secret);
        setState({...state, secret: state.secret})
    }

    async function constructCommitment() {
        console.log("key is: " + state.key)
        console.log("secret is: " + state.secret)
    
        if (state.key === '' || state.secret === '')  {
            alert("Either key or secret are missing!")
            return
        }
        
        let keynew = BigInt(state.key)
        console.log(keynew)
        let secretnew = BigInt(state.secret)
        console.log(secretnew)

        state.commitment = toHex(pedersenHashConcat(keynew, secretnew));
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
            <large><b>ENTER LOTTERY</b></large>
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
        <div class="test-lottery">
          <p>
          Smart contract will be deployed in a few days once enough commitments are collected. 
          For now, make sure to add your commitment to github gist, which serves as your entry into the lottery. You can also test out the functionality in a sample lottery <span></span>
          <Link href='/airdrop/test' passHref>
            <a class="test">
              <span></span>HERE!
            </a>
          </Link>
          </p>
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