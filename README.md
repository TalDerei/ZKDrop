# ZKDrop: Private Airdrop System with Zero-Knowledge Proofs<br />
<br />
Tal Derei <br />
Zero-Knowledge University (ZKU)<br />
April 2022<br />

## 1 Motivation<br />
To motivate this construction, we must map out the current landscape of public crypto airdrops. To encourage participation in their protocol, blockchain-based projects typically send out free ERC-20 tokens to early adopters and active participants in their community. This system of distributing ERC-20 tokens for governance purposes (i.e. token-voting mechanism) is flawed. Participating in these airdrop events requires revealing your public wallet address (i.e. public key), and thereby doxxing your financial history associated with your public identity. Linking your public metamask address to a web3 platform reveals everything about yourself, since your public address is a gateway to publicly available transaction history on the blockchain. Consider, for example, a protocol that decides to blacklist your address from airdrop eligibility based on your DAO voting history? This warranted a system enabling users to claim airdrops completely anonymously, without revealing their public keys.<br />

## 2 Technical Specifications <br />
**_2.1 Merkle-Tree Construction_**<br />
**1.** Construct a merkle tree of commitments, commitment = hash(key, secret), eligible for the airdrop. These commitments are stored in a MongoDB database.<br />
**2.** Recursively hash merkle tree and publish merkle root hash on-chain (~ vector commitment)<br />
**3.** User submits merkle path proof and claims airdrop, without revealing which commitment is associated to their public key. Everytime user enters an input (i.e. the key/secret pair), it generates a witness that serves as an input in the proof generation algorithm.<br />
<br />
**_2.2 Circuits: Proof Generation and Verification_**<br />
The circuits (withdraw.circom and merkleTree.circom) are referenced from a simplified version of the Tornado Cash: https://github.com/chnejohnson/simple-tornado. The circuits (2^16 constraints) will be compiled and proven with Groth16, requiring a trusted setup (i.e. Power of Tau MPC Ceremony). A verifier contract handling the proof verification on-chain is then automatically generated by circom/SnarkyJS.
<br />
<br />
**_2.3 On-Chain Solidity Contract_**<br />
The airdrop contract is responsible for [1] calling the compiled proof-verification contract to verify the proof, [2] checking against the nullifier set to prevent double-withdrawals, [3] redeeming the airdrop.
<br />
<br />
**_2.4 Long-Term Extension_**<br />
The system can be extended to NFT merchandise drops where you prove you own an NFT without revealing your public identity/address. Another extension is incorporating a simple reputation service meeting certain on-chain requirements (i.e. checking whether users have more than 10 ONE in their wallet). This requires a ZK-Oracle or some external trusted third-party entity verifying the validity of the on-chain information before creating the proof.
<br />
<br />
**_2.5 Tools and Resources_**<br />
● Circom 2 (ZK-SNARK Compiler)<br />
● SnarkyJS (Typescript/Javascript framework for zk-SNARKs)<br />
● Tornado Cash<br />
● MongoDB<br />
● React / Next.js / Ether.js / Hardhat<br />

## 3 Codebase <br />
```ABI```
Contains the ABI code for the compiled "Airdrop.sol" smart contract

```Circuits```
Contain the withdraw.circom and merkleTree.circom circuits

```Frontend```
Frontend code containing a React/NextJS framework 

```Scripts```
Contains "build.sh" and "deploy.ts" for running Powers of Tau Ceremony and deploying the smart contracts respectively

## 4 Configuration and Setup <br />
Run "**npm i**" inside the root directory in order to install the proper dependencies. Then navigate to ```Frontend``` and follow the steps outlined in the readme.
 
