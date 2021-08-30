const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const xBlade = artifacts.require("xBlade");
const CryptoWars = artifacts.require("CryptoWars");
const NFTMarket = artifacts.require("NFTMarket");

module.exports = async function (deployer, network) {
  let xBladeAddress;
  if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    xBladeAddress = '0x154a9f9cbd3449ad22fdae23044319d6ef2a1fab';
  }
  else {
    xBladeAddress = xBlade.address;
  }

  await deployProxy(NFTMarket, [xBladeAddress, CryptoWars.address], { deployer });
};
