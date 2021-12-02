const BigNumber = web3.BigNumber
const chai = require('chai')
chai.use(require('chai-bignumber')(BigNumber)).should()
const { expect } = require('chai')

const TimeLockAdvisor = artifacts.require('TimeLockAdvisor')
const Fanart = artifacts.require('FANART')
const { BN, time } = require('openzeppelin-test-helpers')

contract('TimeLockAdvisor', async function ([owner, beneficiary]) {
  let times1 = [1638316800, 1654041600]
  let times2 = [1672531200, 1685577600]
  DECIMALS = web3.utils.toBN(10 ** 18)
  beforeEach(async function () {
    this.fanart = await Fanart.new()
    this.timeLock = await TimeLockAdvisor.new(beneficiary, this.fanart.address)
    await this.fanart.approve(
      this.timeLock.address,
      await this.timeLock.initialTokensBalance(),
    )
    await this.timeLock.initStage()
  })

  describe('TimeLockAdvisor unlock', function () {
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
    it('should release day 0: 1_000_000 - 1/12/2021 - times1[0]', async function () {
      balanceBene = await this.fanart.balanceOf(beneficiary)
      expect(balanceBene).to.eql(web3.utils.toBN(0))

      await time.increaseTo(times1[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(1000000).mul(DECIMALS),
      )
    })

    // #2
    it('Should release term 2: 950_000 - 1/6/2022 - times1[1]', async function () {
      await time.increaseTo(times1[1])

      await this.timeLock.release({ from: beneficiary })

      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(1950000).mul(DECIMALS),
      )
    })

    // #3
    it('Should release term 3: 400_000 - 1/1/2023 & 1/6/2023 - times2[0]', async function () {
      await time.increaseTo(times2[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(2350000).mul(DECIMALS),
      )
      await time.increaseTo(times2[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(2750000).mul(DECIMALS),
      )
    })
  })
})
