const BigNumber = web3.BigNumber;
const chai = require('chai');
chai.use(require('chai-bignumber')(BigNumber)).should();

const FantasyToken = artifacts.require('FantasyToken');

contract('FantasyToken', function([deployer, owner]) {

  beforeEach(async function(){
    this.token = await FantasyToken.new(owner);
  });
  describe('token attributes', function() {
    it('has the correct name', async function() {
      const name = await this.token.name();
      name.should.equal('FANTASY');
    });

    it('has the correct symbol', async function() {
      const symbol = await this.token.symbol();
      symbol.should.equal('FTSY');
    });

    it('has the correct decimals', async function() {
      const decimals = await this.token.decimals();
      expect(decimals).to.eql(web3.utils.toBN('18'));
    });

    it('has the correct init totalSupply', async function() {
      const initSupply = web3.utils.toBN('4000000000000000000000000000')
      expect(await this.token.totalSupply()).to.eql(initSupply);
      expect(await this.token.balanceOf(owner)).to.eql(initSupply);
    });
  });

  describe('#isMinter', function() {
    it('should transfer mint permision to new owner', async function() {
      expect(await this.token.isMinter(owner)).to.eql(true);
    });

    it('deployer should renounce Minter permision', async function() {
      expect(await this.token.isMinter(deployer)).to.eql(false);
    });
  });

  describe('#mint', function() {
    it('should raise error if deployer try to miner again', async function() {
      try {
        await this.token.mint(deployer, 1_000, { from: deployer });
      } catch (err) {
        expect(err.reason).to.equal('MinterRole: caller does not have the Minter role')
      }
    });

    it('should ok from minter', async function() {
      await this.token.mint(deployer, 1_000, { from: owner });
      expect(await this.token.balanceOf(deployer)).to.eql(web3.utils.toBN("1000"));
    });
  });
});
