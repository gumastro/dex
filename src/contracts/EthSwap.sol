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
}