const BigNumber = web3.BigNumber
const chai = require('chai')
chai.use(require('chai-bignumber')(BigNumber)).should()
const { expect } = require('chai')

const TimeLockAdvisor3 = artifacts.require('TimeLockAdvisor3')
const Fanart = artifacts.require('FANART')
const { BN, time } = require('openzeppelin-test-helpers')

contract('TimeLockAdvisor3', async function ([owner, beneficiary]) {
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
  ]
  DECIMALS = web3.utils.toBN(10 ** 18)
  beforeEach(async function () {
    this.fanart = await Fanart.new()
    this.timeLock = await TimeLockAdvisor3.new(beneficiary, this.fanart.address)
    await this.fanart.approve(
      this.timeLock.address,
      await this.timeLock.initialTokensBalance(),
    )
    await this.timeLock.initStage()
  })
  describe('TimeLockAdvisor3 unlock', function () {
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
    // 1/12/2021~1/9/2022 / 50,000 each month(unlock in day 1)
    it('should release day from 1/12/2021~1/9/2022 / 50,000 each month(unlock in day 1) - times1', async function () {
      balanceBene = await this.fanart.balanceOf(beneficiary)
      expect(balanceBene).to.eql(web3.utils.toBN(0))

      await time.increaseTo(times1[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(50000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(100000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[2])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(150000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[3])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(200000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[4])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(250000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[5])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(300000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[6])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(350000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[7])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(400000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[8])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(450000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[9])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(500000).mul(DECIMALS),
      )
      //
    })
  })
})
