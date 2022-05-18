import { ethers, waffle } from "hardhat";
import { abi as ABI, bytecode as BYTECODE } from "@openzeppelin/contracts/build/contracts/ERC20PresetFixedSupply.json";
import { BigNumber } from "@ethersproject/bignumber";

async function main() {
    const [signer] = await ethers.getSigners();

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
        "FactoryAirdrop"
    );
    const factory = await privateLotteryContractFactory.deploy(
        privateLottery.address,
        contractLotteryVerifier.address
    );
    await factory.deployed();
    console.log("Private Lottery Factory Contract Address: ", factory.address);

    // // // Transfer ERC-20 to contract
    // // await ERC20Contract.transfer(privateLottery.address, 50_000);

    let txn = await factory
        .connect(signer)
        .createLottery(
            "0xb20A2739B961F32A7dfC15aE31029F99C386333F",
            BigNumber.from(10_000),
            "0xD9b81Bd828b79a1DcbB51Db5587638Ad07F34110",
            "0x0c9cfdefdc634e23e99587006826af91579533a191b7d10ae7de20ecac366973"
        )
    const { events } = await txn.wait()
    console.log(events)
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    })