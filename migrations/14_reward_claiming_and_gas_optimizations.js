const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const CryptoWars = artifacts.require("CryptoWars");
const Characters = artifacts.require("Characters");

module.exports = async function (deployer) {
  const charas = await Characters.deployed();
  const newCharas = await upgradeProxy(charas.address, Characters, { deployer });
  await newCharas.migrateTo_1ee400a();

  const game = await CryptoWars.deployed();
  await upgradeProxy(game.address, CryptoWars, { deployer });
};
