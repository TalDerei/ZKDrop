import { expect } from "chai";
import { MerkleTree } from "../frontend/utils/src/merkleTree";

const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 20;

describe("merkleTree.ts", () => {
  it("creation odd elements count", async () => {
    const leaves = [12, 13, 14, 15, 16, 17, 18, 19, 20].map(e => e.toString());
    const tree = new MerkleTree(levels);
    leaves.forEach(leaf => {
      tree.insert(leaf);
    });
    const batchTree = new MerkleTree(levels, leaves);

    for (let i = 0; i < leaves.length; i++) {
      expect(tree.proof(i)).to.deep.equal(batchTree.proof(i));
    }
  });
});
