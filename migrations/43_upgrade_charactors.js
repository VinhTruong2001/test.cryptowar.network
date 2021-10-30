const Characters = artifacts.require("Characters");
const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  
  // const proxyAddress = "0x8781413C768f207699D51f42b909c5d6A9D9aD36"; testnet
  const proxyAddress = "0xC38470BFE1b08c3baFDaf699eBa2fCA1fd2B040B"; //mainnet
  await upgradeProxy(proxyAddress, Characters, {
    deployer,
  });
};
