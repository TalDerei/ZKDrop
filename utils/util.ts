import * as crypto from "crypto";
import { readFileSync, writeFileSync } from 'fs';
import { MerkleTree, pedersenHashConcat, toHex } from '../frontend/zkp-merkle-airdrop-lib';

export function randomBigInt(nBytes: number): BigInt {
    return toBigIntLE(crypto.randomBytes(nBytes));
}

export function toBigIntLE (buff: Buffer) {
    const reversed = Buffer.from(buff);
    reversed.reverse();
    const hex = reversed.toString('hex');
    if (hex.length === 0) {
      return BigInt(0);
    }
    return BigInt(`0x${hex}`);
}

export function getMerkleTreeFromPublicListOfCommitments (filename: string, output_filename: string, treeheight: number): MerkleTree {
    let input: string = readFileSync(filename).toString();
    let commitments = input.trim().split(",");

    let counter = 0;
    let commitmentsBigInt: BigInt[] = commitments.map(commitment => BigInt(commitment))
    for (let i = 0; i < commitments.length; i++) {
        console.log(commitmentsBigInt[i])
        counter++
    }
    for (let i = commitments.length; i < 2 ** treeheight; i++) {
        commitmentsBigInt.push(randomBigInt(31));
        console.log(commitmentsBigInt[i])
        counter++
    }
 
    let newCommitments = commitmentsBigInt.toString();

    writeFileSync(output_filename, newCommitments)

    return MerkleTree.createFromLeaves(commitmentsBigInt);
}

export function getMerkleRoot (mt: MerkleTree): string {
    let root = mt.root.val
    return toHex(root)
}
