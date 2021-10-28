const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const Cryptowars = artifacts.require("Cryptowars");
let PancakeUtil = artifacts.require("PancakeUtil");


module.exports = async function (deployer, network, accounts) {

  // await deployer.deploy(PancakeUtil);
  // PancakeUtil = await PancakeUtil.at("0x8803B34E863FA0B2f6e840c38024A9D2252EfE18");
  const pancake = await PancakeUtil.deployed();
  // await deployer.link(pancake, Cryptowars);
  
  // const proxyAddress = "0x8781413C768f207699D51f42b909c5d6A9D9aD36"; testnet
  const proxyAddress = "0x8BA9f0841cFA75d7e2c7a316b048b04c98C95cA4"; //mainnetd
  let cw = await upgradeProxy(proxyAddress, Cryptowars, {
    deployer,
    unsafeAllow: ["external-library-linking"],
  });

  cw.setPancakeUtil(pancake.address)

};
