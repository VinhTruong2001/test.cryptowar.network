const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const CareerMode = artifacts.require("CareerMode");

module.exports = async function (deployer, network) {
  let careerModeProxy;
  if (network === "bsctestnet") {
    careerModeProxy = "0x6da0D16763758a6F6274282081f4DA9E5519e9f3";
  }

  if (network === "bscmainnet") {
    careerModeProxy = "";
  }
  await upgradeProxy(careerModeProxy, CareerMode, {
    deployer,
  });
};
