const Weapons = artifacts.require("Weapons");
const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {

  const proxyAddress = "0x2cb15b0a2bd10beaad6105e0b7219d6edc8288a1"; //testnet
  // const proxyAddress = "0x52683412f6Ea2B6302ceA8406EfF928510466c2c"; //mainnet
  await upgradeProxy(proxyAddress, Weapons, {
    deployer,
    unsafeAllow: ["external-library-linking"],
  });
};
