pragma solidity >=0.5.0 <0.6.0;

import "./CattoToken.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    CattoToken public cattoToken;
    uint public rate = 100;
    bool public flag;

    event CattoPurchased (
        address account,
        address token,
        uint amount,
        uint rate
    );

    event CattoSold (
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(CattoToken _cattoToken) public {
        cattoToken = _cattoToken;
    }

    function buyCatto() public payable {
        // Calculate # of catto to buy
        uint cattoAmount = msg.value * rate;

        require(cattoToken.balanceOf(address(this)) >= cattoAmount && !flag);

        flag = true;

        cattoToken.transfer(msg.sender, cattoAmount);

        // Emit an event
        emit CattoPurchased(msg.sender, address(cattoToken), cattoAmount, rate);

        flag = false;
    }

    function sellCatto(uint _amount) public {
        // User can't sell more catto than they have
        require(cattoToken.balanceOf(msg.sender) >= _amount && !flag);

        flag = true;

        // Calculate # of ether to redeem
        uint etherAmount = _amount / rate;

        // Require that EthSwap has enough Ether
        require(address(this).balance >= etherAmount);

        // Perform sale
        cattoToken.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        // Emit an event
        emit CattoSold(msg.sender, address(cattoToken), _amount, rate);

        flag = false;
    }
}