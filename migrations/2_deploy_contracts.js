const CattoToken = artifacts.require("CattoToken");
const EthSwap = artifacts.require("EthSwap");

module.exports = function(deployer) {
    deployer.deploy(CattoToken);
    deployer.deploy(EthSwap);
};
