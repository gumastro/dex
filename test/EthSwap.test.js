const CattoToken = artifacts.require("CattoToken");
const EthSwap = artifacts.require("EthSwap");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', (accounts) => {
    let cattoToken, ethSwap

    before(async() => {
        cattoToken = await CattoToken.new()
        ethSwap = await EthSwap.new()

        await cattoToken.transfer(ethSwap.address, tokens('1000000'))
    })

    describe('CattoToken deployment', async() => {
        it('contract has a name', async() => {
            const name = await cattoToken.name()
            assert.equal(name, 'Catto Token')
        })
    })

    describe('EthSwap deployment', async() => {
        it('contract has a name', async() => {
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })

        it('contract has catto tokens', async() => {
            let balance = await cattoToken.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })
})