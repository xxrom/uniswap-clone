// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Transactions {
  event Transfer(
    address sender,
    address receiver,
    uint256 amount,
    string message,
    uint256 timestamp,
    string keyword
  );

  /*
   * address from payable to receiver address
   */

  function publishTransaction(
    address payable receiver, // Wallet address where to send
    uint256 amount, // Amount
    string memory message, // `Transferring from to`
    string memory keyword // keyword 'TRANSFER'
  ) public {
    emit Transfer(
      msg.sender,
      receiver,
      amount,
      message,
      block.timestamp,
      keyword
    );
  }
}
