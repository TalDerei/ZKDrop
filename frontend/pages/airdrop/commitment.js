import { useState } from 'react';
import Form from "../../components/form";
import { genProofArgs, groth16, pedersenHashMine, toBufferLE } from '../../utils/src/circuit';
import { MerkleTree, generateProofCallData, pedersenHashConcat, toHex, pedersenHash } from '../../lib';
import { providers, Contract, ethers, BigNumber } from 'ethers';
import * as AIRDROP_JSON from "../../../ABI/Airdrop.json";

export default function Commitment () {
    const [state, setState] = useState ({
        key: "",
        secret: "",
        commitment: "",
        commitment_bool: "",
        airdropAddress: "",
        address: "",
        proof: ""
    });

    const [merkleTreeInput, setTree] =  useState([]);

    let renderMongoDB = () => {
        getCommitment();
    }

    let renderCommitment = () => {
        commitment();
    }

    let renderProofConstruct = () => {
        constructProof();
    }

    let renderTree = () => {
        reconstructMerkleTree();
    }

    let renderCollectDrop = () => {
        collectDrop(state.proof);
    }

    async function commitment() {
        // check if secret or nullifier is null
        if (state.secret == '0' || state.key == '0') {
            console.log("secret or nullifier values are null!")
            return;
        }
        state.secret = BigInt(state.secret);
        state.key = BigInt(state.key);
        const key_buffer = toBufferLE(state.key, 31);
        const secret_buffer = toBufferLE(state.secret, 31);
        const concat = Buffer.concat([key_buffer, secret_buffer]);
        state.commitment = pedersenHashMine(concat);
        console.log("commitment is: " + state.commitment);
        setState({...state});
    }

    async function getCommitment() {
        let post = "45"

        let response = await fetch('/api/check', {
            method: 'POST',
            body: post
        });

        let commitment = await response.json();
        console.log(commitment);

        if (commitment.bool == null) {
            state.commitment_bool = false;
            console.log("commitment is not in merkle tree!")
        } 
        else {
            state.commitment_bool = true;
            console.log("commitment is in merkle tree!")
        }  
        setState({...state});
    }

    // reconstruct merkle tree and load locally -- will be used an input parameter for proof generation algorithm
    let reconstructMerkleTree = async () => {
        if (state.commitment_bool == false) {
            console.log("need correct secret/nullifier pair to reconstruct and load merkle tree!")
        }
        else {
            const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 20;

            console.log("reconstrucing merkle tree, generate root, and load locally");

            // get merkle leaves 
            let response = await fetch('/api/retrieve', {
                method: 'GET',
            });

            let data = await response.json();
            console.log(data);

            let newLeaves = [];

            data.forEach(leaf => {
                newLeaves.push(leaf.commitment_id);
            });

            console.log(newLeaves)

            // construct new tree with leaves
            const tree = new MerkleTree(levels, newLeaves);

            // set state for tree
            setTree(tree);

            // print tree to console
            console.log(tree);
        }
    }  

    async function constructProof() {
        console.log("key is: " + state.key)
        console.log("secret is: " + state.secret)
    
        if (state.key === '' || state.secret === '')  {
            alert("Either key or secret are missing!")
            return
        }
        setState({...state, loading:true})
    
        // Connect to wallet, get address
        let provider = new providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        let signer = provider.getSigner();
        let address = await signer.getAddress();
        console.log("address is: " + address)
        
        // Compute a commitment locally
        let computedCommitment = toHex(pedersenHashConcat(BigInt(state.key), BigInt(state.secret)));
        
        // Load files and run proof locally
        let mtSs = await getFileString(`http://localhost:3000/commitments.txt`);
        let wasmBuff = await getFileBuffer(`http://localhost:3000/circuit.wasm`);
        let zkeyBuff = await getFileBuffer(`http://localhost:3000/circuit_final.zkey`);
        
        // Load the Merkle Tree locally
        let mt = MerkleTree.createFromStorageString(mtSs);
        if (!mt.leafExists(BigInt(computedCommitment))) {
            alert("Leaf corresponding to (key,secret) does not exist in MerkleTree.");
            setState({...state})
            return;
        }
        
        console.log("merkle root is: " + toHex(mt.root.val))
        
        let proof = await generateProofCallData(mt, BigInt(state.key), BigInt(state.secret), address, wasmBuff, zkeyBuff);
        console.log(`Time to compute proof: ${elapsed}ms`);
        setState({...state, proof: proof})
    }

    let collectDrop = async (proof) => {
        console.log("proof is: " + proof);
        console.log("airdrop contract address is: " + state.airdropAddress)

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
            let tx = await contract.collectAirdrop(proof, toHex(keyHash));
            await tx.wait()
        } catch (error) {
            alert("Airdrop collection failed: " + error['data']['message'])
        }
        setState({...state})
    }
    
    return (
        <main>
            <div className="container">
                <div>
                    <Form 
                        state={state}
                        setState={setState}
                    />
                </div>
                <br></br>
                <div> 
                    <button onClick={renderCommitment}>Calculate Commitment</button>
                </div>
                {/* <div>
                    <button onClick={renderMongoDB}>Verify Commitment is in Database</button>
                </div> */}
                <br></br>
                <div>
                    <button onClick={renderTree}>Load Merkle Tree</button>
                </div>
                <br></br>
                <div> 
                    <button onClick={renderProofConstruct}>Calculate Proof</button>
                </div>
                <br></br>
                <div> 
                    <button onClick={renderCollectDrop}>Collect Drop</button>
                </div>
            </div>
        </main>
        
    );    
}

// Data on server-side sent to client (React component)
export async function getServerSideProps(context) {
    try {
      const client = await clientPromise
      const db = client.db('commitment')    
      
      return {
        props: { isConnected: true },
      }
    } catch (e) {
      console.error(e)
      return {
        props: { isConnected: false },
      }
    }
}

async function getFileString(filename) {
  let req = await fetch(filename);
  return await req.text();
}
async function getFileBuffer(filename) {
  let req = await fetch(filename);
  return Buffer.from(await req.arrayBuffer());
}
