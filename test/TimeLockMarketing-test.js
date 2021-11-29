const BigNumber = web3.BigNumber
const chai = require('chai')
chai.use(require('chai-bignumber')(BigNumber)).should()
const { expect } = require('chai')

const TimeLockMarketing = artifacts.require('TimeLockMarketing')
const Fanart = artifacts.require('FANART')
const { BN, time } = require('openzeppelin-test-helpers')

contract('TimeLockMarketing', async function ([owner, beneficiary]) {
  let times1 = [1638316800]

  let times2 = [
    1640995200,
    1654041600,
    1672531200,
    1685577600,
    1704067200,
    1717200000,
    1735689600,
    1748736000,
  ]

  DECIMALS = web3.utils.toBN(10 ** 18)
  beforeEach(async function () {
    this.fanart = await Fanart.new()
    this.timeLock = await TimeLockMarketing.new(beneficiary, this.fanart.address)
    await this.fanart.approve(
      this.timeLock.address,
      await this.timeLock.initialTokensBalance(),
    )
    await this.timeLock.initStage()
  })
  describe('TimeLockMarketing unlock', function () {

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
    it('should release day 0: 6_000_000 - 1/12/2021 - times1[0]', async function () {
      balanceBene = await this.fanart.balanceOf(beneficiary)
      expect(balanceBene).to.eql(web3.utils.toBN(0))

      await time.increaseTo(times1[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(6000000).mul(DECIMALS),
      )
    })

    // 1/1/2022 - 1/6/2022
    // 1/1/2023 - 1/6/2023
    // 1/1/2024 - 1/6/2024
    // 1/1/2025 - 1/6/2025
    it('Should release term 2: 2250000 - from 1/1/2022 -  each 6 months', async function () {
      await time.increaseTo(times2[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(8250000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(10500000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[2])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(12750000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[3])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(15000000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[4])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(17250000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[5])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(19500000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[6])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(21750000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[7])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(24000000).mul(DECIMALS),
      )
    })
  })
})
