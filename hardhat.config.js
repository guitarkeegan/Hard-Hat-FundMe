require("dotenv/config");
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
// require("./tasks/block-number");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("@typechain/hardhat");
require("@nomiclabs/hardhat-solhint");
require("hardhat-deploy");

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://goerli.example.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "hi there"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "what up";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "nice one!";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
    localHost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    }
  },
  // solidity: "0.8.8",
  solidity: {
    compilers: [
      {version: "0.8.8"},
      {version: "0.6.0"},
      {version: "0.7.0"},
    ]
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    // coinmarketcap: COINMARKETCAP_API_KEY,
    token: "ETH"
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    users: {
      default: 1,
    }
  }
};
