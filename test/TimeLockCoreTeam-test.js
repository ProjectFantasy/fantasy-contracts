const BigNumber = web3.BigNumber
const chai = require('chai')
chai.use(require('chai-bignumber')(BigNumber)).should()
const { expect } = require('chai')

const TimeLockCoreTeam = artifacts.require('TimeLockCoreTeam')
const Fanart = artifacts.require('FANART')
const { BN, time } = require('openzeppelin-test-helpers')

contract('TimeLockCoreTeam', async function ([owner, beneficiary]) {
  let times1 = [1638316800]
  let times2 = [
    1654041600,
    1669852800,
    1685577600,
    1701388800,
    1717200000,
    1733011200,
    1748736000,
    1764547200,
    1780272000,
    1796083200,
  ]
  DECIMALS = web3.utils.toBN(10 ** 18)
  beforeEach(async function () {
    this.fanart = await Fanart.new()
    this.timeLock = await TimeLockCoreTeam.new(beneficiary, this.fanart.address)
    await this.fanart.approve(
      this.timeLock.address,
      await this.timeLock.initialTokensBalance(),
    )
    await this.timeLock.initStage()
  })

  describe('TimeLockCoreTeam unlock', function () {
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
    it('should release day 0: 10_000_000 - 1/12/2021 - times1[0]', async function () {
      balanceBene = await this.fanart.balanceOf(beneficiary)
      expect(balanceBene).to.eql(web3.utils.toBN(0))

      await time.increaseTo(times1[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(10000000).mul(DECIMALS),
      )
    })

    // #2
    it('Should release term 2: 4000000 - from 1/6/2022 -  each 6 months', async function () {
      await time.increaseTo(times2[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(14000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(18000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[2])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(22000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[3])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(26000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[4])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(30000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[5])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(34000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[6])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(38000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[7])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(42000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[8])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(46000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[9])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(50000000).mul(DECIMALS),
      )
    })
  })
})