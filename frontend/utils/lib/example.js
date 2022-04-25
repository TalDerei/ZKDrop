"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBigIntLE = exports.randomBigInt = exports.readMerkleTreeAndSourceFromFile = exports.saveMerkleTree = exports.saveMerkleTreeAndSource = exports.generateMerkleTreeAndKeys = void 0;
const crypto = require("crypto");
const fs_1 = require("fs");
const zkp_merkle_airdrop_lib_1 = require("./zkp-merkle-airdrop-lib");
/**
 * Generates a Merkle Tree from random leaves of size @param numLeaves.
 */
function generateMerkleTreeAndKeys(numLeaves) {
    let leafNullifiers = [];
    let leafSecrets = [];
    let leaves = [];
    for (let i = 0; i < numLeaves; i++) {
        leafNullifiers.push(randomBigInt(31));
        leafSecrets.push(randomBigInt(31));
        leaves.push((0, zkp_merkle_airdrop_lib_1.pedersenHashConcat)(leafNullifiers[i], leafSecrets[i]));
    }
    let merkleTree = zkp_merkle_airdrop_lib_1.MerkleTree.createFromLeaves(leaves);
    return { merkleTree, leafNullifiers, leafSecrets };
}
exports.generateMerkleTreeAndKeys = generateMerkleTreeAndKeys;
function saveMerkleTreeAndSource(mts, filePrefix = "") {
    if (mts.leafNullifiers.length != mts.leafSecrets.length)
        throw new Error("MTS improperly constructed.");
    let csvContent = "key,secret,commitment\n";
    for (let i = 0; i < mts.leafNullifiers.length; i++) {
        csvContent += (0, zkp_merkle_airdrop_lib_1.toHex)(mts.leafNullifiers[i])
            + ","
            + (0, zkp_merkle_airdrop_lib_1.toHex)(mts.leafSecrets[i])
            + ","
            + (0, zkp_merkle_airdrop_lib_1.toHex)(mts.merkleTree.leaves[i].val)
            + "\n";
    }
    (0, fs_1.writeFileSync)(`${filePrefix}mt_keys_${mts.leafNullifiers.length}.txt`, csvContent);
    saveMerkleTree(mts.merkleTree, filePrefix);
}
exports.saveMerkleTreeAndSource = saveMerkleTreeAndSource;
function saveMerkleTree(mt, filePrefix = "") {
    let storage = mt.getStorageString();
    (0, fs_1.writeFileSync)(`${filePrefix}mt_${mt.leaves.length}.csv`, storage);
}
exports.saveMerkleTree = saveMerkleTree;
function readMerkleTreeAndSourceFromFile(filename) {
    let leafNullifiers = [];
    let leafSecrets = [];
    let leaves = [];
    let contents = (0, fs_1.readFileSync)(filename, "utf8");
    let lines = contents.split("\n");
    for (let i = 1; i < lines.length; i++) {
        let line = lines[i];
        let tokens = line.split(",");
        if (tokens.length < 3)
            continue;
        let key = tokens[0];
        let secret = tokens[1];
        let commitment = tokens[2].split("\n")[0];
        leafNullifiers.push(BigInt(key));
        leafSecrets.push(BigInt(secret));
        leaves.push(BigInt(commitment));
    }
    let merkleTree = zkp_merkle_airdrop_lib_1.MerkleTree.createFromLeaves(leaves);
    return { merkleTree, leafNullifiers, leafSecrets };
}
exports.readMerkleTreeAndSourceFromFile = readMerkleTreeAndSourceFromFile;
function randomBigInt(nBytes) {
    return toBigIntLE(crypto.randomBytes(nBytes));
}
exports.randomBigInt = randomBigInt;
function toBigIntLE(buff) {
    const reversed = Buffer.from(buff);
    reversed.reverse();
    const hex = reversed.toString('hex');
    if (hex.length === 0) {
        return BigInt(0);
    }
    return BigInt(`0x${hex}`);
}
exports.toBigIntLE = toBigIntLE;
