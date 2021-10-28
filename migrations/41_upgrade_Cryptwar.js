const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const CryptoWars = artifacts.require("CryptoWars");
let PancakeUtil = artifacts.require("PancakeUtil");


module.exports = async function (deployer, network, accounts) {

  await deployer.deploy(PancakeUtil);

  await deployer.link(PancakeUtil, CryptoWars);

  // const proxyAddress = "0x8781413C768f207699D51f42b909c5d6A9D9aD36"; //testnet
  const proxyAddress = "0x8BA9f0841cFA75d7e2c7a316b048b04c98C95cA4"; //mainnetd
  const game = await CryptoWars.deployed()
  await upgradeProxy(proxyAddress, game, {
    deployer,
    unsafeAllow: ["external-library-linking"],
  });


};
