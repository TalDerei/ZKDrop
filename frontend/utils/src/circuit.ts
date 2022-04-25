// @ts-ignore
import { groth16 } from "snarkjs";
// @ts-ignore
const circomlibjs = require('circomlibjs');


/** Compute pedersen hash */
function pedersenHashMine(data: Buffer): BigInt {
  let point = circomlibjs.pedersenHash.hash(data);
  return circomlibjs.babyjub.unpackPoint(point)[0];
}

async function genProofArgs(proof: any, pub: any) {
  proof = unstringifyBigInts(proof);
  pub = unstringifyBigInts(pub);
  const calldata = await groth16.exportSolidityCallData(proof, pub);
  const args = JSON.parse("[" + calldata + "]");
  return args;
}

function toBufferLE(bi: BigInt, width: number): Buffer {
  const hex = bi.toString(16);
  const buffer =
      Buffer.from(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
  buffer.reverse();
  return buffer;
}

// source: https://github.com/iden3/ffjavascript/blob/master/src/utils_bigint.js
function unstringifyBigInts(o: any): any {
  if (typeof o == "string" && /^[0-9]+$/.test(o)) {
    return BigInt(o);
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } else if (typeof o == "object") {
    const res: any = {};
    const keys = Object.keys(o);
    keys.forEach(k => {
      res[k] = unstringifyBigInts(o[k]);
    });
    return res;
  } else {
    return o;
  }
}

// source: https://github.com/no2chem/bigint-buffer/blob/c4d61b5c4fcaab36c55130840e906c162dfce646/src/index.ts#L25
function toBigIntLE(buf: Buffer) {
  const reversed = Buffer.from(buf);
  reversed.reverse();
  const hex = reversed.toString("hex");
  if (hex.length === 0) {
    return BigInt(0);
  }
  return BigInt(`0x${hex}`);
}

/** BigNumber to hex string of specified length */
function toFixedHex(number: number | string, length = 32) {
  const str = BigInt(number).toString(16);
  return "0x" + str.padStart(length * 2, "0");
}

async function getFileString(filename: any) {
  let req = await fetch(filename);
  return await req.text();
}

async function getFileBuffer(filename: any) {
  let req = await fetch(filename);
  return Buffer.from(await req.arrayBuffer());
}

function pedersenHashConcat(nullifier: BigInt, secret: BigInt): BigInt {
  let nullBuff = toBufferLE(nullifier as any, 31);
  let secBuff = toBufferLE(secret as any, 31);
  let combinedBuffer = Buffer.concat([nullBuff, secBuff]);
  return pedersenHashMine(combinedBuffer);
}

 function pedersenHash1(nullifier: BigInt): BigInt {
  return pedersenHashMine(toBufferLE(nullifier as any, 31));
}

export { genProofArgs, unstringifyBigInts, toBigIntLE, pedersenHashMine, toBufferLE, toFixedHex, getFileString, getFileBuffer, pedersenHashConcat, pedersenHash1, groth16 };
