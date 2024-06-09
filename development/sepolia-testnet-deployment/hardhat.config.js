require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;
console.log(PRIVATE_KEY)
module.exports = {
  solidity: "0.7.3",
  // defaultNetwork: "sepolia",
  
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      ens: {
        enabled: false,
      },
    },
    hardhat: {},
    // sepolia: {
    //   url: API_URL,
    //   accounts: [`${PRIVATE_KEY}`]
    // },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        `0xb19bb0f90bb7f02b624cd17abea2af3c81f2c80eb523d63541fd831dd8b17a91`,
      ],
    },
  },
}