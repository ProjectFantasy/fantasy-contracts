//SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

import "@klaytn/contracts/token/KIP7/IKIP7.sol";
import "@klaytn/contracts/math/SafeMath.sol";

contract TimeLockPrivateSell {
  using SafeMath for uint256;

  address public beneficiary;
  address public owner;
  IKIP7 public token;

  struct Stage {
    uint256 amount;
    uint256 releaseTime;
  }

  uint256 withdrawedAmount;
  uint256 constant DECIMALS = 10 ** 18;
  uint256 constant public initialTokensBalance = 6000000 * DECIMALS;

  Stage[] public stages;

  event TokenSent(uint256 amount, uint256 timestamp);

  constructor(address _beneficiary, address _token) public {
    token = IKIP7(_token);
    beneficiary = _beneficiary;
    owner = msg.sender;
  }

  modifier onlyBeneficiary() {
    require(msg.sender == beneficiary, "not_beneficiary");
    _;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "not_owner");
    _;
  }

  function initStage() public onlyOwner {
    token.transferFrom(msg.sender, address(this), initialTokensBalance);
    // Day 0: 01/12/2021 - 1,200,000 (20%)
    // next 2 years, 1,200,000 each 6 months
    {
      uint32[5] memory times = [
        1638316800,
        1654041600,
        1669852800,
        1685577600,
        1701388800
      ];
      for (uint256 i = 0; i < 5; i++) {
        stages.push(Stage(1200000 * DECIMALS, times[i]));
      }
    }
  }

  function release() external onlyBeneficiary {
    uint256 availableAmount = getAvailableAmount();
    require(availableAmount > 0, "invalid_amount");
    sendToken(availableAmount);
  }

  function getAvailableAmount() public view returns(uint256 availableAmount) {
    for (uint256 i = 0; i < stages.length; i++) {
      if (block.timestamp >= stages[i].releaseTime) {
        availableAmount = availableAmount.add(stages[i].amount);
      }
    }

    return availableAmount.sub(withdrawedAmount);
  }

  function sendToken(uint256 _amount) internal {
    withdrawedAmount = withdrawedAmount.add(_amount);
    token.transfer(beneficiary, _amount);
    // emit event
    emit TokenSent(_amount, block.timestamp);
  }
}
