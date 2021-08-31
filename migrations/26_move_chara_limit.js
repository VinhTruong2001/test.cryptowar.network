const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const CryptoWars = artifacts.require("CryptoWars");
const Characters = artifacts.require("Characters");

module.exports = async function (deployer, network, accounts) {
  await upgradeProxy(CryptoWars.address, CryptoWars, { deployer });

  const charas = await upgradeProxy(Characters.address, Characters, { deployer });
  await charas.migrateTo_b627f23();
};
