const { upgradeProxy, deployProxy } = require("@openzeppelin/truffle-upgrades");

const SecretBox = artifacts.require("SecretBox");

module.exports = async function (deployer, network, accounts) {
  if (network === "bsctestnet") {
    // const proxyAddress = "0x7623F407aCD7B4dF49685B079E040ADb29C8EF96";
    // await upgradeProxy(proxyAddress, xBlade, {
    //   deployer,
    //   // initializer: "initialize",
    // });
    // const token = await xBlade.at("0x7623F407aCD7B4dF49685B079E040ADb29C8EF96");
    // token.setAirdropEnabled(true);
  }
  if (network === "bscmainnet") {
    const proxyAddress = "0xFc658Da47B952223Fbf2AB0a00dCc609d07a2E32";
    // await upgradeProxy(proxyAddress, xBlade, {
    //   deployer,
    // });
    const secretBox = await SecretBox.at(proxyAddress);
    await secretBox.setCwController(true);
  }
};
