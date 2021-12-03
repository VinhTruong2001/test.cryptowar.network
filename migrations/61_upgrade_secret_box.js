const { upgradeProxy, deployProxy } = require("@openzeppelin/truffle-upgrades");

const SecretBox = artifacts.require("SecretBox");

module.exports = async function (deployer, network, accounts) {
  if (network === "bsctestnet") {
    const proxyAddress = "0x9a8313127eab2dc37d8dd58a5e8ff144215a2efa";
    await upgradeProxy(proxyAddress, SecretBox, {
      deployer,

    });
  }
  if (network === "bscmainnet") {
    const proxyAddress = "0xFc658Da47B952223Fbf2AB0a00dCc609d07a2E32";
    await upgradeProxy(proxyAddress, SecretBox, {
      deployer,
    });
    // const secretBox = await SecretBox.at(proxyAddress);
    // const cwControllerAddress = "0xAadfa537ecA54d3d7655C4117bBFB83B9bF6035a";
    // await secretBox.setCwController(cwControllerAddress);
    // await secretBox.setCommonBoxPrice(50 * 10 ** 18);
    // await secretBox.setRareBoxPrice(150 * 10 ** 18);
  }
};
