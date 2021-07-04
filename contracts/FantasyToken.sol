// SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

import "@klaytn/contracts/token/KIP7/KIP7Mintable.sol";
import "@klaytn/contracts/token/KIP7/KIP7Burnable.sol";
import "@klaytn/contracts/token/KIP7/KIP7Pausable.sol";
import "@klaytn/contracts/token/KIP7/KIP7Metadata.sol";

contract FantasyToken is KIP7Mintable, KIP7Burnable, KIP7Pausable, KIP7Metadata {

  string constant private _name = "FANTASY";
  string constant private _symbol = "FTSY";
  uint8 constant private _decimals = 18;
  uint256 constant private _initSupply = 4_000_000_000;

  constructor(address _newOwner)
  KIP7Metadata(_name, _symbol, _decimals) public {
    _mint(_newOwner, _initSupply * (10**uint256(_decimals)));
    _addMinter(_newOwner);
    _removeMinter(msg.sender);
  }
}
