const { upgradeProxy, deployProxy } = require("@openzeppelin/truffle-upgrades");

const CWController = artifacts.require("CWController");
const SecretBox = artifacts.require("SecretBox");
const CryptoWars = artifacts.require("CryptoWars");

module.exports = async function (deployer, network, accounts) {
  if (network === "bsctestnet") {
    const controller = await deployProxy(CWController, [], { deployer });
    const router = "0x9ac64cc6e4415144c455bd8e4837fea55603e5c3";
    const busdAddress = "0x78867bbeef44f2326bf8ddd1941a4439382ef2a7";
    const xBladeAddress = "0x28ad774c41c229d48a441b280cbf7b5c5f1fed2b";
    await controller.migrate_v2(router, xBladeAddress, busdAddress);
    await controller.migrateTokenPrice();

    // Upgrade SecretBox just for smoothy test
    const secretBoxAddress = "0x9a8313127eab2dc37d8dd58a5e8ff144215a2efa";
    await upgradeProxy(secretBoxAddress, SecretBox, { deployer });

    // Upgrade CryptoWars
    const cwAddress = "0x717829e31837963fb07dcfb0700423e5be71e5b4";

    await upgradeProxy(cwAddress, CryptoWars, { deployer });
    const cryptoWar = await CryptoWars.at(cwAddress);
    cryptoWar.setCWController(controller.address);
  }
  if (network === "bscmainnet") {
    const proxyAddress = "0xAadfa537ecA54d3d7655C4117bBFB83B9bF6035a";
    await upgradeProxy(proxyAddress, CWController, {
      deployer,
    });

    const controller = await CWController.at(proxyAddress);
    const router = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
    const busdAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
    const xBladeAddress = "0x27a339d9b59b21390d7209b78a839868e319301b";
    await controller.migrate_v2(router, xBladeAddress, busdAddress);
  }
};
