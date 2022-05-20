"use strict";
exports.__esModule = true;
exports.getMerkleRoot = exports.getMerkleTreeFromPublicListOfCommitments = exports.toBigIntLE = exports.randomBigInt = void 0;
var crypto = require("crypto");
var fs_1 = require("fs");
var lib_1 = require("../frontend/zkp-merkle-airdrop-libs/lib");
function randomBigInt(nBytes) {
    return toBigIntLE(crypto.randomBytes(nBytes));
}
exports.randomBigInt = randomBigInt;
function toBigIntLE(buff) {
    var reversed = Buffer.from(buff);
    reversed.reverse();
    var hex = reversed.toString('hex');
    if (hex.length === 0) {
        return BigInt(0);
    }
    return BigInt("0x".concat(hex));
}
exports.toBigIntLE = toBigIntLE;
function getMerkleTreeFromPublicListOfCommitments(filename, output_filename, treeheight) {
    var input = (0, fs_1.readFileSync)(filename).toString();
    var commitments = input.trim().split(",");
    var counter = 0;
    var commitmentsBigInt = commitments.map(function (commitment) { return BigInt(commitment); });
    for (var i = 0; i < commitments.length; i++) {
        // console.log(commitmentsBigInt[i])
    }
    for (var i = commitments.length; i < Math.pow(2, treeheight); i++) {
        commitmentsBigInt.push(randomBigInt(31));
        // console.log(commitmentsBigInt[i])
    }
    var newCommitments = commitmentsBigInt.toString();
    (0, fs_1.writeFileSync)(output_filename, newCommitments);
    return lib_1.MerkleTree.createFromLeaves(commitmentsBigInt);
}
exports.getMerkleTreeFromPublicListOfCommitments = getMerkleTreeFromPublicListOfCommitments;
function getMerkleRoot(mt) {
    var root = mt.root.val;
    return (0, lib_1.toHex)(root);
}
exports.getMerkleRoot = getMerkleRoot;
