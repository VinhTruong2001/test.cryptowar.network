const xBlade = artifacts.require("xBlade");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  const owner = "0xFa3dc497e2835f53E90db15bc2B30D448f90073f";
  await deployProxy(xBlade, [owner], {
    deployer,
    unsafeAllow: ["external-library-linking"],
    initializer: "initialize",
  });
};