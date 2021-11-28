const FANART = artifacts.require("FANART");

const TimeLockAdvisor = artifacts.require("TimeLockAdvisor");
const TimeLockCoreTeam = artifacts.require("TimeLockCoreTeam");
const TimeLockMarketing = artifacts.require("TimeLockMarketing");
const TimeLockSellBuy = artifacts.require("TimeLockSellBuy");
const TimeLockStaking = artifacts.require("TimeLockStaking");
const TimeLockPrivateSell = artifacts.require("TimeLockPrivateSell");

const Ethers = require('ethers')

module.exports = async (deployer) => {

  console.log("Deployer: ", deployer)

  //===== DEPLOY FANART
  console.log("Deploying FANART..............")
  await deployer.deploy(FANART);
  const fanArtInstance = await FANART.deployed()

  const fanArtAddress = fanArtInstance.address
  console.log("FANTART address: %s", fanArtAddress)

  //===== DEPLOY advisor
  console.log("Deploying TimeLockAdvisor..............")
  const advisorAddress = "0xd628dA0A85d59B355adad57f60202a30D26a887C"
  await deployer.deploy(TimeLockAdvisor, advisorAddress, fanArtAddress);
  const timeLockAdvisor = await TimeLockAdvisor.deployed()
  console.log("TimeLockAdvisor deployed to: ", timeLockAdvisor.address);
  console.log("TimeLockAdvisor approving...........");
  await fanArtInstance.approve(timeLockAdvisor.address, await timeLockAdvisor.initialTokensBalance())
  console.log("TimeLockAdvisor initStage...........");
  await timeLockAdvisor.initStage()

  //===== DEPLOY CoreTeam
  console.log("Deploying CoreTeam..............")
  const coreTeamAddress = "0xd066bCa4d1A6d30aBcaB49A7d51f9FB50bB3051D"
  await deployer.deploy(TimeLockCoreTeam, coreTeamAddress, fanArtAddress);
  const timeLockCoreTeam = await TimeLockCoreTeam.deployed()
  console.log("TimeLockCoreTeam deployed to: ", timeLockCoreTeam.address);
  console.log("TimeLockCoreTeam approving...........");
  await fanArtInstance.approve(timeLockCoreTeam.address, await timeLockCoreTeam.initialTokensBalance())
  console.log("TimeLockCoreTeam initStage...........");
  await timeLockCoreTeam.initStage()

  //===== DEPLOY Marketing
  console.log("Deploying Marketing..............")
  const marketingAddress = "0x58081FD8af76D198CB0584dF51d3e1FFD1171746"
  await deployer.deploy(TimeLockMarketing, marketingAddress, fanArtAddress);
  const timeLockMarketing = await TimeLockMarketing.deployed()
  console.log("TimeLockMarketing deployed to: ", timeLockMarketing.address);
  console.log("TimeLockMarketing approving...........");
  await fanArtInstance.approve(timeLockMarketing.address, await timeLockMarketing.initialTokensBalance())
  console.log("TimeLockMarketing initStage...........");
  await timeLockMarketing.initStage()

  //===== DEPLOY TimeLockPrivateSell
  console.log("Deploying TimeLockPrivateSell..............")
  const privateSellAddress = "0x2Bb55883A3671cb1954F1dea6F77f99b95B3297A"
  await deployer.deploy(TimeLockPrivateSell, privateSellAddress, fanArtAddress);
  const timeLockPrivateSell = await TimeLockPrivateSell.deployed()
  console.log("TimeLockPrivateSell deployed to: ", timeLockPrivateSell.address);
  console.log("TimeLockPrivateSell approving...........");
  await fanArtInstance.approve(timeLockPrivateSell.address, await timeLockPrivateSell.initialTokensBalance())
  console.log("TimeLockPrivateSell initStage...........");
  await timeLockPrivateSell.initStage()

  //===== DEPLOY SellBuy
  console.log("Deploying SellBuy..............")
  const sellBuyAddress = "0x2Bb55883A3671cb1954F1dea6F77f99b95B3297A"
  await deployer.deploy(TimeLockSellBuy, sellBuyAddress, fanArtAddress);
  const timeLockSellBuy = await TimeLockSellBuy.deployed()
  console.log("TimeLockSellBuy deployed to: ", timeLockSellBuy.address);
  console.log("TimeLockSellBuy approving...........");
  await fanArtInstance.approve(timeLockSellBuy.address, await timeLockSellBuy.initialTokensBalance())
  console.log("TimeLockSellBuy initStage...........");
  await timeLockSellBuy.initStage()

  //===== DEPLOY Staking
  console.log("Deploying Staking..............")
  const stackingAddress = "0xA6146143AB72A614f6117c4f8fa28D6b72A03E40"
  await deployer.deploy(TimeLockStaking, stackingAddress, fanArtAddress);
  const timeLockStaking = await TimeLockStaking.deployed()
  console.log("TimeLockStaking deployed to: ", timeLockStaking.address);
  console.log("TimeLockStaking approving...........");
  await fanArtInstance.approve(timeLockStaking.address, await timeLockStaking.initialTokensBalance())
  console.log("TimeLockStaking initStage...........");
  await timeLockStaking.initStage()
};
