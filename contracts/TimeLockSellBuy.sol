//SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

import "@klaytn/contracts/token/KIP7/IKIP7.sol";
import "@klaytn/contracts/math/SafeMath.sol";

contract TimeLockSellBuy {
  using SafeMath for uint256;

  address public beneficiary;
  address public owner;
  IKIP7 public token;

  struct Stage {
    uint256 amount;
    uint256 releaseTime;
  }

  uint256 public sentAmount;
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
    // "first year : 35% (unlock each 3 months) :
    // total 17,500,000 - 4,375,000 each unlock
    // 1/12/2021 - 1/3/2022 - 1/6/2022 - 1/9/2022
    {
      uint32[4] memory times = [1638316800, 1646092800, 1654041600, 1661990400];
      for (uint256 i = 0; i < 4; i++) {
        stages.push(Stage(4375000 * DECIMALS, times[i]));
      }
    }
    // 2nd year: 25% (unlock each 6 months)
    // total 12,500,000 - 6,250,000 each unlock
    // 1/12/2022 - 1/6/2023
    {
      uint32[2] memory times = [1669852800, 1685577600];
      for (uint256 i = 0; i < 2; i++) {
        stages.push(Stage(6250000 * DECIMALS, times[i]));
      }
    }
    // 3rd year: 17,25% (unlock each 6 months)
    // total 8,625,000 - 4,312,500 each unlock
    // 1/12/2023 - 1/6/2024
    {
      uint32[2] memory times = [1701388800, 1717200000];
      for (uint256 i = 0; i < 2; i++) {
        stages.push(Stage(4312500 * DECIMALS, times[i]));
      }
    }
    // 4nd year: 12,5%(unlock each 6 months)
    // Total 6,250,000 - 3,125,000 each unlock
    // 1/12/2024 - 1/6/2025
    {
      uint32[2] memory times = [1733011200, 1748736000];
      for (uint256 i = 0; i < 2; i++) {
        stages.push(Stage(3125000 * DECIMALS, times[i]));
      }
    }
    // 5nd year: left (unlock each 6 months)
    // Total 5,125,000 - 2,562,500 each unlock
    // 1/12/2025 - 1/6/2026"
    {
      uint32[2] memory times = [1764547200, 1780272000];
      for (uint256 i = 0; i < 2; i++) {
        stages.push(Stage(2562500 * DECIMALS, times[i]));
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
