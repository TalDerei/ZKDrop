import { useState } from "react";
import Form from "../../components/form"
import { pedersenHash, toBufferLE } from '../../utils';

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
        state.secret = BigInt(state.secret);
        state.nullifier = BigInt(state.nullifier);
        const nullifier_buffer = toBufferLE(state.nullifier, 31);
        const secret_buffer = toBufferLE(state.secret, 31);
        const concat = Buffer.concat([nullifier_buffer, secret_buffer]);
        commitment = pedersenHash(concat);
        console.log(commitment);
        setState({...state});

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