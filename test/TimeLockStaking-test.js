const BigNumber = web3.BigNumber
const chai = require('chai')
chai.use(require('chai-bignumber')(BigNumber)).should()
const { expect } = require('chai')

const TimeLockStaking = artifacts.require('TimeLockStaking')
const Fanart = artifacts.require('FANART')
const { BN, time } = require('openzeppelin-test-helpers')

contract('TimeLockStaking', async function ([owner, beneficiary]) {
  let times1 = [
    1638316800,
    1640995200,
    1643673600,
    1646092800,
    1648771200,
    1651363200,
    1654041600,
    1656633600,
    1659312000,
    1661990400,
    1664582400,
    1667260800,
  ]
  let times2 = [
    1669852800,
    1672531200,
    1675209600,
    1677628800,
    1680307200,
    1682899200,
    1685577600,
    1688169600,
    1690848000,
    1693526400,
    1696118400,
    1698796800,
  ]
  let times3 = [
    1701388800,
    1704067200,
    1706745600,
    1709251200,
    1711929600,
    1714521600,
    1717200000,
    1719792000,
    1722470400,
    1725148800,
    1727740800,
    1730419200,
  ]
  let times4 = [
    1733011200,
    1735689600,
    1738368000,
    1740787200,
    1743465600,
    1746057600,
    1748736000,
    1751328000,
    1754006400,
    1756684800,
    1759276800,
    1761955200,
  ]
  let times5 = [
    1764547200,
    1767225600,
    1769904000,
    1772323200,
    1775001600,
    1777593600,
    1780272000,
    1782864000,
    1785542400,
    1788220800,
    1790812800,
    1793491200,
  ]
  DECIMALS = web3.utils.toBN(10 ** 18)
  beforeEach(async function () {
    this.fanart = await Fanart.new()
    this.timeLock = await TimeLockStaking.new(beneficiary, this.fanart.address)
    await this.fanart.approve(
      this.timeLock.address,
      await this.timeLock.initialTokensBalance(),
    )
    await this.timeLock.initStage()
  })
  describe('TimeLockStaking unlock', function () {

    it('only beneficiary can release amount', async function () {
      try {
        await this.timeLock.release()
      } catch (e) {
        expect(e.message).to.include('not_beneficiary')
      }
    })
    it('Shouldnt receive anything until release time', async function () {
      await this.timeLock
        .release({from: beneficiary})
        .catch((e) => {
          expect(e.message).to.include('invalid_amount')
      })
    })

    // #1
    it('should release First year: 1,200,000 each month (total 14,400,000), 1/12/2021 ~ 1/11/2022', async function () {
      balanceBene = await this.fanart.balanceOf(beneficiary)
      expect(balanceBene).to.eql(web3.utils.toBN(0))

      await time.increaseTo(times1[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(1200000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(2400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[2])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(3600000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[3])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(4800000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[4])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(6000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[5])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(7200000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[6])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(8400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[7])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(9600000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[8])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(10800000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[9])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(12000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[10])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(13200000).mul(DECIMALS),
      ) //
      await time.increaseTo(times1[11])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(14400000).mul(DECIMALS),
      )
    })

    // #2
    it('should release 2nd year: 1,000,000 each month (12,000,000), 1/12/2022 ~ 1/11/2023', async function () {
      await time.increaseTo(times2[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(15400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(16400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[2])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(17400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[3])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(18400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[4])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(19400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[5])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(20400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[6])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(21400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[7])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(22400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[8])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(23400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[9])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(24400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[10])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(25400000).mul(DECIMALS),
      ) //
      await time.increaseTo(times2[11])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(26400000).mul(DECIMALS),
      )
    })

    // #3
    it('should release 3rd year: 800,000 each month (9,600,000), 1/12/2023 ~ 1/11/2024', async function () {
      await time.increaseTo(times3[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(27200000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times3[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(28000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times3[2])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(28800000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times3[3])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(29600000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times3[4])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(30400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times3[5])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(31200000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times3[6])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(32000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times3[7])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(32800000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times3[8])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(33600000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times3[9])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(34400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times3[10])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(35200000).mul(DECIMALS),
      ) //
      await time.increaseTo(times3[11])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(36000000).mul(DECIMALS),
      )
    })

    // #4
    it('should release 3rd year: 600,000 each month (7,200,000), 1/12/2024 ~ 1/11/2025', async function () {
      await time.increaseTo(times4[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(36600000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times4[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(37200000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times4[2])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(37800000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times4[3])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(38400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times4[4])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(39000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times4[5])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(39600000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times4[6])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(40200000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times4[7])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(40800000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times4[8])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(41400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times4[9])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(42000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times4[10])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(42600000).mul(DECIMALS),
      ) //
      await time.increaseTo(times4[11])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(43200000).mul(DECIMALS),
      )
    })

    // #5
    it('should release 3rd year: 566,667 each month (6,800,000), 1/12/2025 ~ 1/11/2026', async function () {
      await time.increaseTo(times5[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(43766666).mul(DECIMALS),
      )
      //
      await time.increaseTo(times5[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(44333332).mul(DECIMALS),
      )
      //
      await time.increaseTo(times5[2])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(44899998).mul(DECIMALS),
      )
      //
      await time.increaseTo(times5[3])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(45466664).mul(DECIMALS),
      )
      //
      await time.increaseTo(times5[4])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(46033330).mul(DECIMALS),
      )
      //
      await time.increaseTo(times5[5])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(46599996).mul(DECIMALS),
      )
      //
      await time.increaseTo(times5[6])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(47166662).mul(DECIMALS),
      )
      //
      await time.increaseTo(times5[7])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(47733328).mul(DECIMALS),
      )
      //
      await time.increaseTo(times5[8])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(48299994).mul(DECIMALS),
      )
      //
      await time.increaseTo(times5[9])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(48866660).mul(DECIMALS),
      )
      //
      await time.increaseTo(times5[10])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(49433326).mul(DECIMALS),
      ) //
      await time.increaseTo(times5[11])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(50000000).mul(DECIMALS),
      )
    })
  })
})