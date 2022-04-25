/// <reference types="node" />
import { groth16 } from "snarkjs";
/** Compute pedersen hash */
declare function pedersenHashMine(data: Buffer): BigInt;
declare function genProofArgs(proof: any, pub: any): Promise<any>;
declare function toBufferLE(bi: BigInt, width: number): Buffer;
declare function unstringifyBigInts(o: any): any;
declare function toBigIntLE(buf: Buffer): bigint;
/** BigNumber to hex string of specified length */
declare function toFixedHex(number: number | string, length?: number): string;
declare function getFileString(filename: any): Promise<string>;
declare function pedersenHashConcat(nullifier: BigInt, secret: BigInt): BigInt;
declare function pedersenHash1(nullifier: BigInt): BigInt;
export { genProofArgs, unstringifyBigInts, toBigIntLE, pedersenHashMine, toBufferLE, toFixedHex, getFileString, pedersenHashConcat, pedersenHash1, groth16 };
