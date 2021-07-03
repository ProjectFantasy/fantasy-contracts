const FantasyToken = artifacts.require("FantasyToken");

module.exports = function (deployer) {
  const tokenOwner = process.env.TOKEN_OWNER;
  console.log(deployer);
  deployer.deploy(FantasyToken, tokenOwner);
};
