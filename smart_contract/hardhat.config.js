// old version
//require("@nomiclabs/hardhat-waffle");
//
require("@nomicfoundation/hardhat-toolbox");

/*
 * @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    "eth-goerli": {
      // --network eth-goerli
      url: "https://eth-goerli.g.alchemy.com/v2/Oj6M6-b1X3oOQIv_ugUsMwOY0KgtIVtY",
      accounts: [
        "bebb363ff40e12acc4857ea9803337fe7e303b543497c8c6cd42054a921d7974",
      ],
    },
  },
};
