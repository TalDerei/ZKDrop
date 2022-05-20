import { ethers, waffle } from "hardhat";
import { abi as ABI, bytecode as BYTECODE } from "@openzeppelin/contracts/build/contracts/ERC20PresetFixedSupply.json";
import { BigNumber } from "@ethersproject/bignumber";
import { getMerkleTreeFromPublicListOfCommitments, getMerkleRoot } from '../utils/util';
import { readFileSync, writeFileSync } from 'fs';
import { hexStripZeros } from "ethers/lib/utils";
import { providers, Contract } from 'ethers';
import * as AIRDROP_JSON from "../frontend/abi/PrivateLottery.json";

async function main() {
    const [signer] = await ethers.getSigners();

    let commitmentsFileName = "./public/commitments.txt" 
    let output_file = "./frontend/public/commitments.txt"
    let temp_file = "./public/commitments.txt"
    let input: string = readFileSync(temp_file).toString();
    let commitments = input.trim().split(",");
    console.log(commitments)
    // let commitmentsBigInt: BigInt[] = commitments.map(commitment => BigInt(commitment))
    // console.log(commitmentsBigInt)
    let mt = getMerkleTreeFromPublicListOfCommitments(commitmentsFileName, output_file, 6)
    let newRoot = getMerkleRoot(mt)
    console.log("Root hash is: " + newRoot)

    // Deploy ERC-20 contract
    let ERC20Contract = await waffle.deployContract(
        signer, {bytecode: BYTECODE, abi: ABI},
        [
            "Harmony-ZK-Drop", 
            "HZD", 
            BigNumber.from(100_000),
            signer.address
        ])
    console.log(`ERC-20 Address: ${ERC20Contract.address}`)
    
    // Deploy circuit verifier contract
    const contractFactoryVerifier = await ethers.getContractFactory(
        "PlonkVerifier"
    );
    const contractLotteryVerifier = await contractFactoryVerifier.deploy();
    await contractLotteryVerifier.deployed();
    console.log("Lottery Verifier Contract Address: ", contractLotteryVerifier.address);

    // Deploy private lottery contract implementation
    const privateLotteryContract = await ethers.getContractFactory(
        "PrivateLottery"
    );
    const privateLottery = await privateLotteryContract.deploy();
    await privateLottery.deployed();
    console.log("Private Lottery Contract Address: ", privateLottery.address);

    // Deploy private lottery factory contract 
    const privateLotteryContractFactory = await ethers.getContractFactory(
        "PrivateLotteryFactory"
    );
    const factory = await privateLotteryContractFactory.deploy(
        privateLottery.address,
        contractLotteryVerifier.address
    );
    await factory.deployed();
    console.log("Private Lottery Factory Contract Address: ", factory.address);

    let txn = await factory
        .connect(signer)
        .createLottery(
            ERC20Contract.address,
            BigNumber.from(10_000),
            contractLotteryVerifier.address,
            newRoot, 
            commitments
        )

    // Retrieve proxy contract address
    const { events } = await txn.wait();
    const { args } = events.find(Boolean);
    const proxyAddress = args[0];
    console.log("Proxy address is: ", proxyAddress)

    // Get commitments stored as calldata in smart contract
    let contract = new Contract(proxyAddress, AIRDROP_JSON.abi, signer);
    let getCommitments = await contract.getAllCommitments();
    console.log("Original Commitments are: ");
    console.log(getCommitments)

    // Initialize random indexes
    let setIndexes = await contract.setRandomIndexes();
    console.log(setIndexes);
    let getIndexes = await contract.getRandomIndexes();
    console.log("Indexes are: ");
    console.log(getIndexes);

    // Choose random commitments from commitment set for eligibility
    console.log("Setting random commitments: ");
    let setCommitment = await contract.setRandomCommitment()
    console.log(setCommitment);

    console.log("Eligible commitments: ")
    var getCommitment = await contract.getRandomCommitment();
    console.log(getCommitment);

    // console.log("True or False: ")
    // var eligible = await contract.getEligible(0x1775e0bf4871ccdcdd3b79d1cea52894870ea81b4280af1a1a7924d016aa20a3);
    // console.log(eligible);

    // Transfer ERC-20 to contract
    await ERC20Contract.transfer(proxyAddress, 50_000);
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    })