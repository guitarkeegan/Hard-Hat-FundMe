# Hardhat FundMe

This was a tutorial project from Patrick Collins through Free Code Camp. The project is all about the setup for writing a smart contract with Solidity, importing chainlink pricefeeds, testing and deploying the contract both locally and on a testnet. It was a ton of work but I learned a lot in the process. 

## Getting Started

```
To download the project and run locally..
I used yarn, but I believe npm works as well.
Clone the repository clicking on code in the upper right corner and copy the clone link.
In the terminal write 
git clone <paste the url here>
Next you can try several commands for interacting with the contracts. 
Install all packages
npm install
or 
yarn install
to see available tasks run
yarn hardhat
 ```

## Things to Try

Try ```yarn test``` to run all tests in the test folder. You can do ```yarn hardhat compile``` to compile all of the contracts found in the contracts folder. ```yarn hardhat node``` will spin up a node on your local machine with sample ethereum wallets to interact with. To deploy the contract on a testnet, you will need a metamask wallet with faucet funds (I used the Goerli testnet), as well as an etherscan API key for verification. You will also need to GOERLI_RPC_URL which can be found at [Chainlink](https://docs.chain.link/docs/data-feeds/price-feeds/). Once you have those variable setup, you can try the staging tests with ```yarn run test:staging``` which will test interactions with the deployed FundMe contract on the Goerli testnet. 

## Contact

I'm still learning, but I'm excited about these technologies. If you'd like to ask any questions or collaborate on this kind of thing, please feel free to reach out. [keegananglim@gmail.com](mailto:keegananglim@gmail.com) Thanks!