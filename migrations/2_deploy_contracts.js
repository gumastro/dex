const CattoToken = artifacts.require("CattoToken");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {
    await deployer.deploy(CattoToken);
    const catto = await CattoToken.deployed()

    await deployer.deploy(EthSwap);
    const ethswap = await EthSwap.deployed()

    // Transfer all Catto tokens to EthSwap
    await catto.transfer(ethswap.address, '1000000000000000000000000')
};
