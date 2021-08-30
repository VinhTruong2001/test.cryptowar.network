const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const CryptoWars = artifacts.require("CryptoWars");
const Characters = artifacts.require("Characters");
const Weapons = artifacts.require("Weapons");

module.exports = async function (deployer) {
  const charas = await Characters.deployed();
  await upgradeProxy(charas.address, Characters, { deployer });

  const weps = await Weapons.deployed();
  const newWeps = await upgradeProxy(weps.address, Weapons, { deployer });

  await newWeps.migrateTo_e55d8c5();

  const game = await CryptoWars.deployed();
  await upgradeProxy(game.address, CryptoWars, { deployer });
};
