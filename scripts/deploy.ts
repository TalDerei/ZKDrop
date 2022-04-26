import { ethers, waffle } from "hardhat";
import { abi as ERC20_ABI, bytecode as ERC20_BYTECODE } from "@openzeppelin/contracts/build/contracts/ERC20PresetFixedSupply.json";
import { BigNumber } from "@ethersproject/bignumber";

async function main() {
    let [ownerSigner] = await ethers.getSigners();
    
    // deploy erc-20 contract
    let erc20Contract = await waffle.deployContract(
        ownerSigner,
        {bytecode: ERC20_BYTECODE, abi: ERC20_ABI}, 
        [
            "Harmony-ZK-Drop", 
            "HZD", 
            BigNumber.from(100_000),
            ownerSigner.address
        ])
    console.log(`ERC20 address: ${erc20Contract.address}`)

    // deploy verifier contract
    const contractFactoryVerifier = await ethers.getContractFactory(
        "PlonkVerifier"
      );
      const contractAirdropVerifier = await contractFactoryVerifier.deploy();
      await contractAirdropVerifier.deployed();
      console.log(
        "AirdropVerifier Contract deployed to:",
        contractAirdropVerifier.address
      );

      // deploy main private airdrop contract
    const contractFactoryAirdrop = await ethers.getContractFactory("Airdrop");
    const contractAirdrop = await contractFactoryAirdrop.deploy(
        erc20Contract.address,
        BigNumber.from(10_000),
        contractAirdropVerifier.address,
        "0x0c9cfdefdc634e23e99587006826af91579533a191b7d10ae7de20ecac366973"
    );
    await contractAirdrop.deployed();
    console.log("Airdrop Contract deployed to:", contractAirdrop.address);

    // erc transfer to contract
    await erc20Contract.transfer(contractAirdrop.address, 50_000);
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    })