const { assert, expect } = require("chai");
const {deployments, ethers, getNamedAccounts} = require("hardhat");

!developmentChains.includes(network.name)
? describe.skip
:
describe("FundMe", function() {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("1"); // 1 eth
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        console.log(`deployer is: ${deployer}`);
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);

    })
    describe("constructor", async function(){
        it("sets the aggregator addresses correctly", async function(){
            const response = await fundMe.s_priceFeed();
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    describe("fund", async function(){
        it("Fails if you don't send enough eth", async function(){
            await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
        });
        it("updated the amount funded data structure", async function(){
            await fundMe.fund({value: sendValue});
            const response = await fundMe.s_addressToAmountFunded(deployer);
            assert.equal(response.toString(), sendValue.toString());
        });
        it("adds funder to array of s_funders", async function(){
            await fundMe.fund({value: sendValue});
            const funder = await fundMe.s_funders(0);
            assert.equal(funder, deployer);
        });
    });
    describe("withdraw", async function(){
        beforeEach(async function(){
            await fundMe.fund({value: sendValue});
        })

        it("can withdraw ETH from a single funder", async function(){
            // arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);
            // Act
            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);
            const {gasUsed, effectiveGasPrice} = transactionReceipt;
            const totalGasCost = gasUsed.mul(effectiveGasPrice);

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
            //assert
            assert.equal(endingFundMeBalance, 0);
            assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(), endingDeployerBalance.add(totalGasCost).toString());
        });

        it("allows us to withdraw with multiple s_funders", async function(){
            //arrange
            const accounts = await ethers.getSigners();
            for (let i=1;i<6;i++){
                const fundMeConnectedContract = await fundMe.connect(accounts[i]);
                await fundMeConnectedContract.fund({value: sendValue});
            }
            

            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            //act
            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);
            const {gasUsed, effectiveGasPrice} = transactionReceipt;
            const totalGasCost = gasUsed.mul(effectiveGasPrice);
            //assert
            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
 
            assert.equal(endingFundMeBalance, 0);
            assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(), endingDeployerBalance.add(totalGasCost).toString());
            // are the s_funders reset properly?
            await expect(fundMe.s_funders(0)).to.be.reverted;

            for (let i=1;i<6;i++){
                assert.equal(await fundMe.s_addressToAmountFunded(accounts[i].address), 0)
            }
        })

        it("only allows the owner to withdraw", async function(){
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerConnectedContract = await fundMe.connect(attacker);
            await expect(attackerConnectedContract.withdraw()).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
        })

        it("allows withdraw with cheaper setting", async function(){
            //arrange
            const accounts = await ethers.getSigners();
            for (let i=1;i<6;i++){
                const fundMeConnectedContract = await fundMe.connect(accounts[i]);
                await fundMeConnectedContract.fund({value: sendValue});
            }
            

            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            //act
            const transactionResponse = await fundMe.cheaperWithdraw();
            const transactionReceipt = await transactionResponse.wait(1);
            const {gasUsed, effectiveGasPrice} = transactionReceipt;
            const totalGasCost = gasUsed.mul(effectiveGasPrice);
            //assert
            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
 
            assert.equal(endingFundMeBalance, 0);
            assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(), endingDeployerBalance.add(totalGasCost).toString());
            // are the s_funders reset properly?
            await expect(fundMe.s_funders(0)).to.be.reverted;

            for (let i=1;i<6;i++){
                assert.equal(await fundMe.s_addressToAmountFunded(accounts[i].address), 0)
            }
        })
    })
})