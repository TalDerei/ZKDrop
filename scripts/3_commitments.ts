import {randomBigInt} from "../utils/util";
import {toHex, pedersenHashConcat } from "../frontend/zkp-merkle-airdrop-libs";
var fs = require('fs')

async function main() {
    let commitments_file = "./public/commitments_sample.txt" 

    for (let i = 0; i < 300; i++) {
        let nullifier = toHex(randomBigInt(31)) 
        let secret = toHex(randomBigInt(31))
        // console.log("Key is: " + nullifier)
        // console.log("Secret is: " + secret)

        let nullifierHex = BigInt(nullifier)
        let secretHex = BigInt (secret)
        let commitment = pedersenHashConcat(nullifierHex, secretHex)
        let commitmentHex = toHex(commitment)
        // console.log("Commitment is: " + commitmentHex);

        try {
            fs.appendFileSync("./public/commitments_sample.txt", commitmentHex+",");
            } catch (err) {
            console.error(err);
        }

        try {
            fs.appendFileSync("./public/commitments_sample_list.txt", "Key is: " + nullifier);
            fs.appendFileSync("./public/commitments_sample_list.txt", "\n");
            fs.appendFileSync("./public/commitments_sample_list.txt", "Secret is: " + secret);
            fs.appendFileSync("./public/commitments_sample_list.txt", "\n");
            fs.appendFileSync("./public/commitments_sample_list.txt", "Commitment is: " + commitmentHex);
            fs.appendFileSync("./public/commitments_sample_list.txt", "\n");
            fs.appendFileSync("./public/commitments_sample_list.txt", "\n");

            // file written successfully
            } catch (err) {
            console.error(err);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    })