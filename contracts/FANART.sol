// SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

import "@klaytn/contracts/token/KIP7/KIP7Mintable.sol";
import "@klaytn/contracts/token/KIP7/KIP7Burnable.sol";
import "@klaytn/contracts/token/KIP7/KIP7Pausable.sol";
import "@klaytn/contracts/token/KIP7/KIP7Metadata.sol";

contract FANART is KIP7Mintable, KIP7Burnable, KIP7Pausable, KIP7Metadata {

  string constant private _name = "Fantasy Art";
  string constant private _symbol = "FANART";
  uint8 constant private _decimals = 18;
  uint256 constant private _maxCap = 200_000_000;

  constructor()
  KIP7Metadata(_name, _symbol, _decimals) public {
    _mint(msg.sender, _maxCap * (10**uint256(_decimals)));
    _removeMinter(msg.sender);
  }
}
