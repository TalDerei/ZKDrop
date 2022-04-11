import { useState } from "react";
import Form from "../../components/form"
import Link from 'next/link'
import {toFixedHex } from "../../utils/ethers"
import { MiMCSponge } from "../../utils/merkleTree"
import { toBigIntLE } from "../../utils/circuit"

export default function commitment () {
    const [state, setState] = useState ({
        nullifier: "",
        secret: ""
    });

    // calculate commitment function 
    let calculateCommitment = () => {
        commitment();
    }

    // commitment = hash(nullifier, secret)
    async function commitment() {
        state.secret = toFixedHex(state.secret);
        state.nullifier = toFixedHex(state.nullifier);
        const hash = await MiMCSponge(state.secret, state.nullifier);

        alert("commitment! Nullifier: " + state.nullifier + " and Secret: " + state.secret);
        alert("hash! hash: " + hash);

        const sauce = toBigIntLE(state.secret).toString();
        console.log(sauce);

    }

    return (
        <main>
        <div>
            <Form 
                state={state}
                setState={setState}
            />
        </div>
        <button onClick={calculateCommitment}>Calculate Commitment</button>
    </main>

    );
}