require('dotenv').config();

const Caver = require('caver-js')
const HDWalletProvider = require("truffle-hdwallet-provider-klaytn");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
      gas: 6000000
    },
    baobab: {
      provider: () => { return new HDWalletProvider(process.env.TESTNET_DEPLOYER_PRIVATE_KEY, 'https://api.baobab.klaytn.net:8651') },
      network_id: 1001, //Klaytn baobab testnet's network id
      gas: 8000000,
      gasPrice: 25000000000
    },
    cypress: {
      provider: () => {
        const option = {
          headers: [
            { name: 'Authorization', value: 'Basic ' + Buffer.from(process.env.ACCESSKEY_ID + ':' + process.env.SECRET_ACCESSKEY).toString('base64') },
            { name: 'x-chain-id', value: '8217' }
          ],
          keepAlive: false,
        }
        return new HDWalletProvider(process.env.MAINNET_DEPLOYER_PRIVATE_KEY, new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option))
      },
      network_id: 8217, //Klaytn mainnet's network id
      gas: 8000000,
      gasPrice: 25000000000
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.16",    // Fetch exact version from solc-bin (default: truffle's version)
      docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "constantinople"
      }
    }
  },
};
