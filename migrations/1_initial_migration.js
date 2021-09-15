const xBlade = artifacts.require("xBlade");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {

//  const owner = "0x2CC6D07871A1c0655d6A7c9b0Ad24bED8f940517";

  const owner = "0x5678917FfEb77827Aafc33419E99DaCd707313a9";

  await deployProxy(xBlade, [owner], {
    deployer,
    unsafeAllow: ["external-library-linking"],
    initializer: "initialize",
  });
};