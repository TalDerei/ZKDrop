"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groth16 = exports.pedersenHash1 = exports.pedersenHashConcat = exports.getFileString = exports.toFixedHex = exports.toBufferLE = exports.pedersenHashMine = exports.toBigIntLE = exports.unstringifyBigInts = exports.genProofArgs = void 0;
// @ts-ignore
const snarkjs_1 = require("snarkjs");
Object.defineProperty(exports, "groth16", { enumerable: true, get: function () { return snarkjs_1.groth16; } });
// @ts-ignore
const circomlibjs = require('circomlibjs');
/** Compute pedersen hash */
function pedersenHashMine(data) {
    let point = circomlibjs.pedersenHash.hash(data);
    return circomlibjs.babyjub.unpackPoint(point)[0];
}
exports.pedersenHashMine = pedersenHashMine;
function genProofArgs(proof, pub) {
    return __awaiter(this, void 0, void 0, function* () {
        proof = unstringifyBigInts(proof);
        pub = unstringifyBigInts(pub);
        const calldata = yield snarkjs_1.groth16.exportSolidityCallData(proof, pub);
        const args = JSON.parse("[" + calldata + "]");
        return args;
    });
}
exports.genProofArgs = genProofArgs;
function toBufferLE(bi, width) {
    const hex = bi.toString(16);
    const buffer = Buffer.from(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
    buffer.reverse();
    return buffer;
}
exports.toBufferLE = toBufferLE;
// source: https://github.com/iden3/ffjavascript/blob/master/src/utils_bigint.js
function unstringifyBigInts(o) {
    if (typeof o == "string" && /^[0-9]+$/.test(o)) {
        return BigInt(o);
    }
    else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    }
    else if (typeof o == "object") {
        const res = {};
        const keys = Object.keys(o);
        keys.forEach(k => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    }
    else {
        return o;
    }
}
exports.unstringifyBigInts = unstringifyBigInts;
// source: https://github.com/no2chem/bigint-buffer/blob/c4d61b5c4fcaab36c55130840e906c162dfce646/src/index.ts#L25
function toBigIntLE(buf) {
    const reversed = Buffer.from(buf);
    reversed.reverse();
    const hex = reversed.toString("hex");
    if (hex.length === 0) {
        return BigInt(0);
    }
    return BigInt(`0x${hex}`);
}
exports.toBigIntLE = toBigIntLE;
/** BigNumber to hex string of specified length */
function toFixedHex(number, length = 32) {
    const str = BigInt(number).toString(16);
    return "0x" + str.padStart(length * 2, "0");
}
exports.toFixedHex = toFixedHex;
function getFileString(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        let req = yield fetch(filename);
        return yield req.text();
    });
}
exports.getFileString = getFileString;
function pedersenHashConcat(nullifier, secret) {
    let nullBuff = toBufferLE(nullifier, 31);
    let secBuff = toBufferLE(secret, 31);
    let combinedBuffer = Buffer.concat([nullBuff, secBuff]);
    return pedersenHashMine(combinedBuffer);
}
exports.pedersenHashConcat = pedersenHashConcat;
function pedersenHash1(nullifier) {
    return pedersenHashMine(toBufferLE(nullifier, 31));
}
exports.pedersenHash1 = pedersenHash1;
