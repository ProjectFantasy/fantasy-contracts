const FANART = artifacts.require("FANART");

const TimeLockAdvisor = artifacts.require("TimeLockAdvisor");
const TimeLockAdvisor2 = artifacts.require("TimeLockAdvisor2");
const TimeLockAdvisor3 = artifacts.require("TimeLockAdvisor3");
const TimeLockCoreTeam = artifacts.require("TimeLockCoreTeam");
const TimeLockMarketing = artifacts.require("TimeLockMarketing");
const TimeLockSellBuy = artifacts.require("TimeLockSellBuy");
const TimeLockStaking = artifacts.require("TimeLockStaking");

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

  console.log("Deploying TimeLockAdvisor2..............")
  const advisorAddress2 = "0x93975C4c4d11B4aDee88A0549BD0e82152075aE6"
  await deployer.deploy(TimeLockAdvisor2, advisorAddress2, fanArtAddress);
  const timeLockAdvisor2 = await TimeLockAdvisor2.deployed()
  console.log("TimeLockAdvisor2 deployed to: ", timeLockAdvisor2.address);  //===== DEPLOY advisor
  console.log("TimeLockAdvisor approving...........");
  await fanArtInstance.approve(timeLockAdvisor2.address, await timeLockAdvisor2.initialTokensBalance())
  console.log("timeLockAdvisor2 initStage...........");
  await timeLockAdvisor2.initStage()

  console.log("Deploying TimeLockAdvisor3..............")
  const advisorAddress3 = "0xCeB6aE2e53Af1EAdFF2d7324e1d06fAa10587755"
  await deployer.deploy(TimeLockAdvisor3, advisorAddress3, fanArtAddress);
  const timeLockAdvisor3 = await TimeLockAdvisor3.deployed()
  console.log("TimeLockAdvisor3 deployed to: ", timeLockAdvisor3.address);
  console.log("TimeLockAdvisor approving...........");
  await fanArtInstance.approve(timeLockAdvisor3.address, await timeLockAdvisor3.initialTokensBalance())
  console.log("timeLockAdvisor3 initStage...........");
  await timeLockAdvisor3.initStage()

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
