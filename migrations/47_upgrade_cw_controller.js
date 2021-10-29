const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const CWController = artifacts.require("CWController");

module.exports = async function (deployer, network, accounts) {
  const proxyAddress = "0x2F809DF5522E3e81cfac0766F7f24f64A3A9359D"
  await upgradeProxy(
    proxyAddress,
    CWController,
    {
      deployer,
    }
  );
};
