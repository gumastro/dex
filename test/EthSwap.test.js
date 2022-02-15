const { assert } = require('chai');

const CattoToken = artifacts.require("CattoToken");
const EthSwap = artifacts.require("EthSwap");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer, investor]) => {
    let cattoToken, ethSwap

    before(async() => {
        cattoToken = await CattoToken.new()
        ethSwap = await EthSwap.new(cattoToken.address)

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

    describe('buyCatto()', async() => {
        let result;

        before(async() => {
            // Purchase Catto
            result = await ethSwap.buyCatto({ from: investor, value: tokens('1') })
        })

        it('allows user to instantly purchase Catto from ethSwap for a fixed price', async() => {
            // Check investor catto balance after purchase
            let investorBalance = await cattoToken.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            // Check ethSwap catto balance after purchase
            let ethSwapBalance = await cattoToken.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))

            // Check ethSwap ether balance after purchase
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('1'))

            // Check emited event after purchase
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, cattoToken.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })
    })
})