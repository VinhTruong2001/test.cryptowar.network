const Weapons = artifacts.require("Weapons");
const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  
  // const proxyAddress = "0x8781413C768f207699D51f42b909c5d6A9D9aD36"; testnet
  const proxyAddress = "0x52683412f6Ea2B6302ceA8406EfF928510466c2c"; //mainnet
  await upgradeProxy(proxyAddress, Weapons, {
    deployer,
    unsafeAllow: ["external-library-linking"],
  });
};
