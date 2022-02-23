const { network } = require('hardhat');

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // deploy the mock only locally or on tesnets
  if (network.tags.local || network.tags.testnet) {
    await deploy('ERC721CollectionMock', {
      from: deployer,
      log: true,
      args: [],
    });
  }
};

module.exports.tags = ['erc721_collection_mock'];
