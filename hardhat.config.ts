import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.11",
  networks: {
    testnet: {
      url: `https://api.s0.b.hmny.io`,
      accounts: [process.env.TESTNET_PRIVATE_KEY],
      gas: 9900000,
      gasPrice: 80000000000
    },
    mainnet: {
      url: `https://api.harmony.one`,
      accounts: [process.env.TESTNET_PRIVATE_KEY],
      gas: 9900000,
      gasPrice: 80000000000
    },
  },
};