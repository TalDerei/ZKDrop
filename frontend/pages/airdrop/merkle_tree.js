import { useState } from 'react'
import clientPromise from '../mongodb'
import { MerkleTree } from "../../utils/src/merkleTree";
import { toFixedHex } from "../../utils/src/circuit";
import {useRouter} from "next/router";

export default function MerkleTrees() {
    const { query } = useRouter();

    // add commitment to merkle tree
    let addCommitment = async () => {
        console.log("adding commitment to tree"); 
        
        // change to users commitment 
        console.log(query.keyword);
        
        // const retrieveCommitmnent = async () => {
        let post = {
            commitment_id: "10"
        };

        let response = await fetch('/api/post', {
            method: 'POST',
            body: JSON.stringify(post)
        });

        let data = await response.json();
        console.log(data);
    }

    // reconstruct merkle tree and load locally -- will be used an input parameter for proof generation algorithm
    let reconstructMerkleTree = async () => {
        const levels = Number(process.env.MERKLE_TREE_HEIGHT) || 20;

        console.log("reconstrucing merkle tree, generate root, and load locally");

        // get merkle leavges 
        let response = await fetch('/api/retrieve', {
            method: 'GET',
        });

        let data = await response.json();
        console.log(data);

        let newLeaves = [];

        // const leaves = [data].map(e => e.toString());

        data.forEach(leaf => {
            newLeaves.push(leaf.commitment_id);
        });

        console.log(newLeaves)

        const tree = new MerkleTree(levels);
        newLeaves.forEach(leaf => {
            tree.insert(leaf);
        });

        console.log(tree);

        // const batchTree = new MerkleTree(levels, leaves);
    }   

    const renderAddCommitment = () => {
        return (
            <button onClick={addCommitment}>Add Commitment to Tree Commitment</button>
        );
    }
    
    const renderMerkleTreeConstruct = () => {
        return (
            <button onClick={reconstructMerkleTree}>Construct Merkle Tree</button>
        );
    }
    
    const renderMerkleTree = () => {
        return (
            <>
                <div className="renderAddCommitment">
                    {renderAddCommitment()}
                </div>
                <div className="renderMerkleTreeConstruct">
                    {renderMerkleTreeConstruct()}
                </div>
            </>
        );
    }

    return (
        <div className="merkleTree">
            {renderMerkleTree()}
        </div>
    );
}

// Data on server-side sent to client (React component)
export async function getServerSideProps(context) {
    try {
      const client = await clientPromise
      const db = client.db('commitment')    
      
      return {
        props: { isConnected: true },
      }
    } catch (e) {
      console.error(e)
      return {
        props: { isConnected: false },
      }
    }
  }