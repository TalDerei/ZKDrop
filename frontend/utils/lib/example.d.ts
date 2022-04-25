/// <reference types="node" />
import { MerkleTree } from './zkp-merkle-airdrop-lib';
/** MerkleTree and inputs used to derive. */
export interface MerkleTreeAndSource {
    merkleTree: MerkleTree;
    leafNullifiers: BigInt[];
    leafSecrets: BigInt[];
}
/**
 * Generates a Merkle Tree from random leaves of size @param numLeaves.
 */
export declare function generateMerkleTreeAndKeys(numLeaves: number): MerkleTreeAndSource;
export declare function saveMerkleTreeAndSource(mts: MerkleTreeAndSource, filePrefix?: string): void;
export declare function saveMerkleTree(mt: MerkleTree, filePrefix?: string): void;
export declare function readMerkleTreeAndSourceFromFile(filename: string): MerkleTreeAndSource;
export declare function randomBigInt(nBytes: number): BigInt;
export declare function toBigIntLE(buff: Buffer): bigint;
