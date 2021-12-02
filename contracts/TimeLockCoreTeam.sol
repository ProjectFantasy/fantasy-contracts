//SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

import "@klaytn/contracts/token/KIP7/IKIP7.sol";
import "@klaytn/contracts/math/SafeMath.sol";

contract TimeLockCoreTeam {
  using SafeMath for uint256;

  address public beneficiary;
  address public owner;
  IKIP7 public token;

  struct Stage {
    uint256 amount;
    uint256 releaseTime;
  }

  uint256 sentAmount;
  uint256 constant DECIMALS = 10 ** 18;
  uint256 constant public initialTokensBalance = 50000000 * DECIMALS;

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
    // Day 0: 10,000,000
    // 1/12/2021
    stages.push(Stage(10000000 * DECIMALS, 1638316800));

    // after 4 year, each 6 months: 4,000,000
    // 1/6/2022 - 1/12/2022 - 1/6/2023 - 1/12/2023
    // 1/6/2024 - 1/12/2024 - 1/6/2025
    // 1/12/2025 - 1/6/2026 - 1/12/2026
    {
      uint32[10] memory times = [
        1654041600,
        1669852800,
        1685577600,
        1701388800,
        1717200000,
        1733011200,
        1748736000,
        1764547200,
        1780272000,
        1796083200
      ];
      for (uint256 i = 0; i < 10; i++) {
        stages.push(Stage(4000000 * DECIMALS, times[i]));
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

    return availableAmount.sub(sentAmount);
  }

  function sendToken(uint256 _amount) internal {
    sentAmount = sentAmount.add(_amount);
    token.transfer(beneficiary, _amount);

    // emit event
    emit TokenSent(_amount, block.timestamp);
  }
}
