const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const xBladeStakingRewardsUpgradeable = artifacts.require("xBladeStakingRewardsUpgradeable");

const CryptoWars = artifacts.require("CryptoWars");

module.exports = async function (deployer, network, accounts) {
  if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    const xBladeAddress = '0x154A9F9cbd3449AD22FDaE23044319D6eF2a1Fab';
    const xBladeStakingRewards =  await deployProxy(xBladeStakingRewardsUpgradeable, [accounts[0], accounts[0], xBladeAddress, xBladeAddress, 7 * 24 * 60 * 60], { deployer });

    // 0.001 minimumStakeAmount
    await xBladeStakingRewards.migrateTo_8cb6e70('1000000000000000');

    const game = await CryptoWars.deployed()
    await game.migrateTo_23b3a8b(xBladeStakingRewards.address);
    await xBladeStakingRewards.migrateTo_23b3a8b(game.address);
  }
};
