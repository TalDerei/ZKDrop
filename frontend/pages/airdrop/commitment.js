import { useState, useEffect } from "react";
import Form from "../../components/form";
import Link from "next/link";
import { pedersenHash, toBufferLE } from '../../utils';

export default function Commitment () {
    const [state, setState] = useState ({
        nullifier: "",
        secret: "",
        commitment:""
    });

    // calculate commitment function 
    let calculateCommitment = () => {
        commitments();
    }

    // commitment = pedersenHash(nullifier, secret)
    async function commitments() {
        state.secret = BigInt(state.secret);
        state.nullifier = BigInt(state.nullifier);
        const nullifier_buffer = toBufferLE(state.nullifier, 31);
        const secret_buffer = toBufferLE(state.secret, 31);
        const concat = Buffer.concat([nullifier_buffer, secret_buffer]);
        state.commitment = pedersenHash(concat);
        console.log(state.commitment);
        // setState({...state});
    }

    useEffect(() => {
        console.log('trigger use effect hook');
      }, []);

    return (
        <main>
        <div>
            <Form 
                state={state}
                setState={setState}
            />
        </div>
        <button onClick={calculateCommitment}>Calculate Commitment</button>
        <div>
        <Link href={{ pathname: '/airdrop/merkle_tree', query: { keyword: state.commitment } }}>
          <a>Construct Merkle Tree</a> 
        </Link>
        </div>
    </main>

    );
}