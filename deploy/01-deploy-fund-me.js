const {networkConfig, developmentChains} = require("../helper-hardhat-config");
const {network} = require("hardhat");
const {verify} = require("../utils/verify");

//hre
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;

    if (developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        log("hit else to get price feed on goerli");
        log(`chain ID: ${chainId}`)
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"]
    }
    log(`ethUsdPriceFeedAddress is .. ${ethUsdPriceFeedAddress}`);
    const args = [ethUsdPriceFeedAddress];

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log(`fundMe address is ${fundMe.address}`);
        await verify(fundMe.address, args);
    }
    log("----------------------------------------------")
}

module.exports.tags = ["all", "fundme"];