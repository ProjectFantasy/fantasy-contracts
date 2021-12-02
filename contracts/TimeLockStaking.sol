//SPDX-License-Identifier: MIT
pragma solidity 0.5.16;

import "@klaytn/contracts/token/KIP7/IKIP7.sol";
import "@klaytn/contracts/math/SafeMath.sol";

contract TimeLockStaking {
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
    // First year: 1,200,000 each month (total 14,400,000)
    // 1/12/2021 ~ 1/11/2022 (release on day 1 each month)
    {
      uint32[12] memory times = [1638316800, 1640995200, 1643673600, 1646092800, 1648771200, 1651363200, 1654041600, 1656633600, 1659312000, 1661990400, 1664582400, 1667260800];
      for (uint256 i = 0; i < 12; i++) {
        stages.push(Stage(1200000 * DECIMALS, times[i]));
      }
    }

    // 2nd year: 1,000,000 each month (12,00,000)
    // 1/12/2022 ~ 1/11/2023 (release on day 1 each month)
    {
      uint32[12] memory times = [1669852800, 1672531200, 1675209600, 1677628800, 1680307200, 1682899200, 1685577600, 1688169600, 1690848000, 1693526400, 1696118400, 1698796800];
      for (uint256 i = 0; i < 12; i++) {
        stages.push(Stage(1000000 * DECIMALS, times[i]));
      }
    }

    // 3rd year: 800,000 each month (9,600,000)
    // 1/12/2023 ~ 1/11/2024 (release on day 1 each month)
    {
      uint32[12] memory times = [1701388800, 1704067200, 1706745600, 1709251200, 1711929600, 1714521600, 1717200000, 1719792000, 1722470400, 1725148800, 1727740800, 1730419200];
      for (uint256 i = 0; i < 12; i++) {
        stages.push(Stage(800000 * DECIMALS, times[i]));
      }
    }


    // 4nd year: 600,000 each month (7,200,000)
    // 1/12/2024 ~ 1/11/2025 (release on day 1 each month)
    {
      uint32[12] memory times = [1733011200, 1735689600, 1738368000, 1740787200, 1743465600, 1746057600, 1748736000, 1751328000, 1754006400, 1756684800, 1759276800, 1761955200];
      for (uint256 i = 0; i < 12; i++) {
        stages.push(Stage(600000 * DECIMALS, times[i]));
      }
    }

    // 5nd year: 566,667 each month ( 6,800,000)
    // 1/12/2025 ~ 1/10/2026 (release on day 1 each month)
    {
      uint32[11] memory times = [1764547200, 1767225600, 1769904000, 1772323200, 1775001600, 1777593600, 1780272000, 1782864000, 1785542400, 1788220800, 1790812800];
      for (uint256 i = 0; i < 11; i++) {
        stages.push(Stage(566666 * DECIMALS, times[i]));
      }
    }

    // 5nd: last month - 1/11/2026 - 566674
    stages.push(Stage(566674 * DECIMALS, 1793491200));

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
