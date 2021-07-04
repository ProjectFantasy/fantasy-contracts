const FantasyToken = artifacts.require("FantasyToken");

module.exports = function (deployer) {
  const tokenOwner = process.env.TOKEN_OWNER;
  deployer.deploy(FantasyToken, tokenOwner);
};
