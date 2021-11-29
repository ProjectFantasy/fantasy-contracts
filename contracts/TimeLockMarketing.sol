//SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

import "@klaytn/contracts/token/KIP7/IKIP7.sol";
import "@klaytn/contracts/math/SafeMath.sol";

contract TimeLockMarketing {
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
  uint256 constant public initialTokensBalance = 24000000 * DECIMALS;

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
    // Day 0: 6,000,000
    // 1/12/2021
    stages.push(Stage(6000000 * DECIMALS, 1638316800));

    // next 4 years: 2,250,000 each 6 months
    // 1/1/2022 - 1/6/2022
    // 1/1/2023 - 1/6/2023
    // 1/1/2024 - 1/6/2024
    // 1/1/2025 - 1/6/2025
    {
      uint32[8] memory times = [
        1640995200,
        1654041600,
        1672531200,
        1685577600,
        1704067200,
        1717200000,
        1735689600,
        1748736000
      ];
      for (uint256 i = 0; i < 8; i++) {
        stages.push(Stage(2250000 * DECIMALS, times[i]));
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
