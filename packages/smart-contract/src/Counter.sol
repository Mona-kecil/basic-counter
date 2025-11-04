// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        require(newNumber >= 0, "Number cannot be negative");
        require(newNumber <= type(uint256).max, "Number cannot be greater than max value");
        number = newNumber;
    }

    function increment() public {
        require(number <= type(uint256).max, "Cannot increment beyond max value");
        number++;
    }

    function decrement() public {
        require(number >= 0, "Cannot decrement below zero");
        number--;
    }
}
