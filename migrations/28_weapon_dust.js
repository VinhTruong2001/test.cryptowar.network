const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const CryptoWars = artifacts.require("CryptoWars");
const Characters = artifacts.require("Characters");
const Weapons = artifacts.require("Weapons");

module.exports = async function (deployer, network, accounts) {
  // Migrate when deploy in 8_main_game.js
  // await upgradeProxy(Characters.address, Characters, { deployer });
  // await upgradeProxy(Weapons.address, Weapons, { deployer });
  // const game = await upgradeProxy(CryptoWars.address, CryptoWars, { deployer });
  // await game.migrateTo_801f279();
};
