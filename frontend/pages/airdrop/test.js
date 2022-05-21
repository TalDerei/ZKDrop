import { useEffect, useRef, useState } from 'react';
import Form from "../../components/form";
import { MerkleTree, generateProofCallData, pedersenHashConcat, toHex, pedersenHash } from '../../zkp-merkle-airdrop-libs/lib';
import { providers, Contract, ethers, BigNumber } from 'ethers';
import * as AIRDROP_JSON from "../../abi/PrivateLottery.json";
import GoBack from "../../components/goBack";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";
import { pedersenHashMine, toBufferLE } from '../../utils/src/circuit';
import Link from "next/link";

// import * as crypto from "crypto";
const crypto = require("crypto");

export default function Test () {
    const [state, setState] = useState ({
        key: "",
        secret: "",
        commitment: "",
        commitment_bool: "",
        airdropAddress: "",
        address: "",
        proof: "",
        computedCommitment: "",
        airdrop: ""
    });

    const [merkleTreeInput, setTree] =  useState([]);

    let renderCommitment = () => {
        commitment();
    }

    let renderProofConstruct = () => {
        constructProof();
    }

    let renderCollectDrop = () => {
        collectDrop(state.proof);
    }

    async function commitment() {
        // check if secret or nullifier is null
        if (state.key === '' || state.secret === '')  {
            alert("Either key or secret are missing!")
            return
        }

        console.log("Key is: " + state.key);
        console.log("Secret is: " + state.secret);

        state.computedCommitment = toHex(pedersenHashConcat(BigInt(state.key), BigInt(state.secret)));
        console.log("commitment is: " + state.computedCommitment);

        setState({...state});
    }

    async function constructProof() {
        console.log("key is: " + state.key)
        console.log("secret is: " + state.secret)
    
        if (state.key === '' || state.secret === '')  {
            alert("Either key or secret are missing!")
            return
        }

        console.log("commitment is: " + state.computedCommitment);
    
        // Connect to wallet, get address
        let provider = new providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        let signer = provider.getSigner();
        let address = await signer.getAddress();
        console.log("address is: " + address)
        
        // Compute a commitment locally
        // state.computedCommitment = toHex(pedersenHashConcat(BigInt(state.key), BigInt(state.secret)));
        // console.log("!!!!!!!!!!!!!! computed commitment is: " + state.computedCommitment)
        
        // Load files and run proof locally
        let mtSs = await getFileString(`http://localhost:3000/commitments.txt`);
        let wasmBuff = await getFileBuffer(`http://localhost:3000/circuit.wasm`);
        let zkeyBuff = await getFileBuffer(`http://localhost:3000/circuit_final.zkey`);
        console.log(mtSs)
        let commitments = mtSs.trim().split(",");
        // console.log(commitments)
        
        // let treeheight = 5

        let commitmentsBigInt = commitments.map(commitment => BigInt(commitment))
        console.log(commitmentsBigInt)
        // // for (let i = commitments.length; i < 2 ** treeheight; i++) {
        // //     commitmentsBigInt.push(randomBigInt(31));
        // // }
        // // let commitmentsBigInts = commitmentsBigInt.map(commitmentsBigInt => BigInt(commitmentsBigInt))
        // console.log("wooooo!")
        // console.log(commitmentsBigInt)

        // // console.log(crypto.randomBytes(31))
        
        
        // Load the Merkle Tree locally
        // let mt = MerkleTree.createFromStorageString(mtSs);
        let mt = MerkleTree.createFromLeaves(commitmentsBigInt);

        if (!mt.leafExists(BigInt(state.computedCommitment))) {
            alert("Leaf corresponding to (key,secret) does not exist in MerkleTree.");
            setState({...state})
            return;
        }
        console.log("merkle root is: " + toHex(mt.root.val))
        
        let proof = await generateProofCallData(mt, BigInt(state.key), BigInt(state.secret), address, wasmBuff, zkeyBuff);

        console.log("proof is: " + proof);
        console.log("airdrop contract address is: " + state.airdropAddress)

        setState({...state, proof: proof})
    }

    let collectDrop = async (proof) => {
        if (state.proof === '') {
            alert("No proof calculated yet!")
            return
        }
        if (state.airdropAddress === '') {
            alert("No airdrop address entered!")
            return
        }

        let provider = new providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        let contract = new Contract(state.airdropAddress, AIRDROP_JSON.abi, provider.getSigner());
        let keyHash = pedersenHash(BigInt(state.key));

        try {
            let tx = await contract.collectAirdrop(state.computedCommitment, proof, toHex(keyHash));
            await tx.wait()
            console.log(tx.hash)
            state.airdrop = tx.hash;
        } catch (error) {
            alert("Airdrop collection failed: " + error['data']['message'])
        }
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
            <div className="container">
                <div class="status">
                    <large>SAMPLE LOTTERY:</large>
                    <br></br>
                    <large>CHECK LOTTERY STATUS</large>
                </div>
                <div class="form-class-top">
                    <Form 
                        state={state}
                        setState={setState}
                    />
                </div>
                    <div class="button-group">
                        <button class="button button1 b1" onClick={renderCommitment}>Calculate Commitment</button>
                        <br></br>
                        <button class="button button1 b2" onClick={renderProofConstruct}>Calculate Proof</button>
                        <br></br>
                        <button class="button button1 b3" onClick={renderCollectDrop}>Collect Drop</button>
                    </div>
                </div>
                <div class="commitment-new">
                    <div class="card-header">
                        <b>Commitment:</b>
                    </div>
                    <div class="card-body">
                        {state.computedCommitment === ''?
                    <div>
                    </div> :
                    <div>
                        {state.computedCommitment}
                    </div>
                    }
                    </div>
                </div>
                <div class="proof-new">
                    <div class="card-header">
                        <b>Proof:</b>
                    </div>
                    <div class="card-body">
                        {state.proof === ''?
                    <div>
                    </div> :
                    <div>
                        {state.proof}
                    </div>
                    }
                    </div>
                </div>
                <div class="drop-new">
                    <div class="card-header">
                        <b>Airdrop:</b>
                    </div>
                    <div class="card-body">
                        {state.airdropAddress === ''?
                    <div>
                    </div> :
                    <div>
                        {state.airdrop}
                    </div>
                    }
                    </div>
                </div>
            <div className="mb-10">
                <GoBack />
            </div>
            </section>
        </main>
    );    
}

async function getFileString(filename) {
  let req = await fetch(filename);
  return await req.text();
}
async function getFileBuffer(filename) {
  let req = await fetch(filename);
  return Buffer.from(await req.arrayBuffer());
}