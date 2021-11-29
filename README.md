

### Env variables:

```
TOKEN_OWNER
TESTNET_DEPLOYER_PRIVATE_KEY
MAINNET_DEPLOYER_PRIVATE_KEY

# Basic Authen to request cypress node
ACCESSKEY_ID
SECRET_ACCESSKEY
```

### Setup

```
$ cp .env.example .env # Fill up variable value
$ npm install

# To run test at local
#
$ ganache-cli -b 0
$ # Run docker
$ truffle test <file-path> // Please reset ganache-cli and run each file separately due to increase_Time_EVM problem

# To deploy at local
#
$ truffle deploy --network baobab

# To deploy at local
#
$ truffle deploy --network cypress
```
