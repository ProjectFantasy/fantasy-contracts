const BigNumber = web3.BigNumber
const chai = require('chai')
chai.use(require('chai-bignumber')(BigNumber)).should()
const { expect } = require('chai')

const TimeLockPrivateSell = artifacts.require('TimeLockPrivateSell')
const Fanart = artifacts.require('FANART')
const { BN, time } = require('openzeppelin-test-helpers')

contract('TimeLockPrivateSell', async function ([owner, beneficiary]) {
  let times1 = [1638316800, 1654041600, 1669852800, 1685577600, 1701388800]
  DECIMALS = web3.utils.toBN(10 ** 18)
  beforeEach(async function () {
    this.fanart = await Fanart.new()
    this.timeLock = await TimeLockPrivateSell.new(beneficiary, this.fanart.address)
    await this.fanart.approve(
      this.timeLock.address,
      await this.timeLock.initialTokensBalance(),
    )
    await this.timeLock.initStage()
  })

  describe('TimeLockPrivateSell unlock', function () {
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
    })
  })
})