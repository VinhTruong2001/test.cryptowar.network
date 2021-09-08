const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const LP2StakingRewardsUpgradeable = artifacts.require("LP2StakingRewardsUpgradeable");

module.exports = async function (deployer, network, accounts) {
  // Comment for ignore LP2 staking
  if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    const ownerAddress = accounts[0];
    const rewardDistributorAddress = '0xC2573A26297a0c952C92bb48Fdcb6929524F7F48';

    const xBladeTokenAddress = '0x154A9F9cbd3449AD22FDaE23044319D6eF2a1Fab';
    const lpTokenAddress = '0xC19dfd34D3ba5816dF9CBDaa02D32A9F8dc6F6fC';

    await deployProxy(LP2StakingRewardsUpgradeable, [ownerAddress, rewardDistributorAddress, xBladeTokenAddress, lpTokenAddress, 0], { deployer });
  }
};

