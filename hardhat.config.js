require('@ericnordelo/hardhat-upgrade');
require('@tenderly/hardhat-tenderly');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-web3');
require('@nomiclabs/hardhat-truffle5');
require('solidity-coverage');
require('hardhat-gas-reporter');
require('hardhat-contract-sizer');
require('hardhat-deploy');

require('dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const INFURA_POLYGON_RPC_URL = process.env.INFURA_POLYGON_RPC_URL;
const INFURA_BSC_RPC_URL = process.env.INFURA_BSC_RPC_URL;

module.exports = {
  networks: {
    hardhat: {
      tags: ['local'],
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      tags: ['local'],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
      accounts: { mnemonic: MNEMONIC },
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
      accounts: { mnemonic: MNEMONIC },
    },
    bsctestnet: {
      chainId: 97,
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      gasPrice: 20000000000,
      accounts: { mnemonic: MNEMONIC },
      tags: ['testnet'],
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      tags: ['testnet'],
    },
    polygon: {
      url: INFURA_POLYGON_RPC_URL,
      accounts: [PRIVATE_KEY],
      tags: ['mainnet'],
    },
    bsc: {
      url: INFURA_BSC_RPC_URL,
      accounts: [PRIVATE_KEY],
      tags: ['mainnet'],
    },
  },
  upgradeable: {
    uups: ['NFTAuthenticator'],
  },
  tenderly: {
    project: 'beckett',
    username: 'ericnordelo',
  },
  namedAccounts: {
    deployer: 0,
    user: 1,
    bob: 2,
    alice: 3,
  },
  gasReporter: {
    enabled: false,
  },
  mocha: {
    timeout: 999999,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};
