const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const xBladeStakingRewardsUpgradeable = artifacts.require("xBladeStakingRewardsUpgradeable");
const LPStakingRewardsUpgradeable = artifacts.require("LPStakingRewardsUpgradeable");
// const LP2StakingRewardsUpgradeable = artifacts.require("LP2StakingRewardsUpgradeable");
const CryptoWars = artifacts.require("CryptoWars");

module.exports = async function (deployer, network, accounts) {
  // Ignore upgrade
  // await upgradeProxy(LPStakingRewardsUpgradeable.address, LPStakingRewardsUpgradeable, { deployer });
  // await upgradeProxy(LP2StakingRewardsUpgradeable.address, LP2StakingRewardsUpgradeable, { deployer });

  // const xBladeStakingRewards = await upgradeProxy(xBladeStakingRewardsUpgradeable.address, xBladeStakingRewardsUpgradeable, { deployer });

  // const game = await upgradeProxy(CryptoWars.address, CryptoWars, { deployer });

  // await game.migrateTo_23b3a8b(xBladeStakingRewards.address);
  // await xBladeStakingRewards.migrateTo_23b3a8b(game.address);
};
