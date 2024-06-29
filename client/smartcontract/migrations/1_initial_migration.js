const Migration = artifacts.require("MoneyDistribution");

module.exports = function (deployer) {
  deployer.deploy(Migration);
};
