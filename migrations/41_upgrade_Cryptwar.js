const Cryptowars = artifacts.require("Cryptowars");
const PancakeUtil = artifacts.require("PancakeUtil");

const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {


  await deployer.deploy(PancakeUtil);
  
  await deployer.link(PancakeUtil, CryptoWars);
  
  // const proxyAddress = "0x8781413C768f207699D51f42b909c5d6A9D9aD36"; testnet
  const proxyAddress = "0x8BA9f0841cFA75d7e2c7a316b048b04c98C95cA4"; //mainnetd
  await upgradeProxy(proxyAddress, Cryptowars, {
    deployer,
    unsafeAllow: ["external-library-linking"],
  });

};
