const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const CWController = artifacts.require("CWController");

module.exports = async function (deployer, network, accounts) {
  const proxyAddress = "0x29317C450496958fE15bC0076591a04fb5Bbb766"
  await upgradeProxy(
    proxyAddress,
    CWController,
    {
      deployer,
    }
  );
};
