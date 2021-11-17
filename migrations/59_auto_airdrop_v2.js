const { upgradeProxy, deployProxy } = require("@openzeppelin/truffle-upgrades");

const xBlade = artifacts.require("xBlade");

module.exports = async function (deployer, network, accounts) {
  if (network === "bsctestnet") {
    const proxyAddress = "0x7623F407aCD7B4dF49685B079E040ADb29C8EF96";
    await upgradeProxy(proxyAddress, xBlade, {
      deployer,
      // initializer: "initialize",
    });
    // const token = await xBlade.at("0x7623F407aCD7B4dF49685B079E040ADb29C8EF96");
    // token.setAirdropEnabled(true);
  }
};
