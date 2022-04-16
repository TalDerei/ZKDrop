"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
var config = {
    defaultNetwork: "hardhat",
    solidity: {
        compilers: [{ version: "0.7.6", settings: {} }],
    },
    networks: {},
};
exports.default = config;
