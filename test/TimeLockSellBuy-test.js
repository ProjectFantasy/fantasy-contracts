const BigNumber = web3.BigNumber
const chai = require('chai')
chai.use(require('chai-bignumber')(BigNumber)).should()
const { expect } = require('chai')

const TimeLockSellBuy = artifacts.require('TimeLockSellBuy')
const Fanart = artifacts.require('FANART')
const { BN, time } = require('openzeppelin-test-helpers')

contract('TimeLockSellBuy', async function ([owner, beneficiary]) {

  let times1 = [1638316800, 1646092800, 1654041600, 1661990400]
  let times2 = [1669852800, 1685577600]
  let times3 = [1701388800, 1717200000]
  let times4 = [1733011200, 1748736000]
  let times5 = [1764547200, 1780272000]
  DECIMALS = web3.utils.toBN(10 ** 18)

  beforeEach(async function () {
    this.fanart = await Fanart.new()
    this.timeLock = await TimeLockSellBuy.new(beneficiary, this.fanart.address)
    await this.fanart.approve(
      this.timeLock.address,
      await this.timeLock.initialTokensBalance(),
    )
    await this.timeLock.initStage()
  })
  describe('TimeLockSellBuy unlock', function () {

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
    // total 17,500,000 - 4,375,000 each unlock
    // 1/12/2021 - 1/3/2022 - 1/6/2022 - 1/9/2022
    it('should release 35% (unlock each 3 months)', async function () {
      balanceBene = await this.fanart.balanceOf(beneficiary)
      expect(balanceBene).to.eql(web3.utils.toBN(0))

      await time.increaseTo(times1[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(4375000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(8750000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[2])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(13125000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times1[3])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(17500000).mul(DECIMALS),
      )
    })

    // #2
    // 2nd year: 25% (unlock each 6 months)
    // total 12,500,000 - 6,250,000 each unlock
    // 1/12/2022 - 1/6/2023
    it('should release 2nd year: 25% (unlock each 6 months)', async function () {
      await time.increaseTo(times2[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(23750000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times2[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(30000000).mul(DECIMALS),
      )
    })

    // #3
    // 3rd year: 17,25% (unclock each 6 months)
    // total 8,625,000 - 4,312,500 each unlock
    // 1/12/2023 - 1/6/2024
    it('should release 3rd year: 17,25% (unclock each 6 months)', async function () {
      balanceBene = await this.fanart.balanceOf(beneficiary)
      expect(balanceBene).to.eql(web3.utils.toBN(0))

      await time.increaseTo(times3[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(34312500).mul(DECIMALS),
      )
      //
      await time.increaseTo(times3[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(38625000).mul(DECIMALS),
      )
    })

    // #4
    // 4nd year: 12,5%(unlock each 6 months)
    // Total 6,250,000 - 3,125,000 each unlock
    // 1/12/2024 - 1/6/2025
    it('should release 4nd year: 12,5%(unlock each 6 months)', async function () {
      await time.increaseTo(times4[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(41750000).mul(DECIMALS),
      )
      //
      await time.increaseTo(times4[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(44875000).mul(DECIMALS),
      )
    })

    // #5
    // 5nd year: left (unlock each 6 months)
    // Total 5,125,000 - 2,562,500 each unlock
    // 1/12/2025 - 1/6/2026"
    it('should release 4nd year: 12,5%(unlock each 6 months)', async function () {
      await time.increaseTo(times5[0])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(47437500).mul(DECIMALS),
      )
      //
      await time.increaseTo(times5[1])
      await this.timeLock.release({ from: beneficiary })
      expect(await this.fanart.balanceOf(beneficiary)).to.be.bignumber.equal(
        new BN(50000000).mul(DECIMALS),
      )
    })
  })
})