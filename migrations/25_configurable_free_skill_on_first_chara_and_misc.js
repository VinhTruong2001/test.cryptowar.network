const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

// const CryptoWars = artifacts.require("CryptoWars");
// const Weapons = artifacts.require("Weapons");
const Promos = artifacts.require("Promos");

module.exports = async function (deployer, network, accounts) {
  const promos = await upgradeProxy(Promos.address, Promos, { deployer });

  await promos.migrateTo_f73df27();

  // await upgradeProxy(CryptoWars.address, CryptoWars, { deployer });
  // await upgradeProxy(Weapons.address, Weapons, { deployer });
};
