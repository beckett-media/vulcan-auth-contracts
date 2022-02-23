const NFTAuthenticator = artifacts.require('NFTAuthenticator');

const { expectRevert, expectEvent, constants } = require('@openzeppelin/test-helpers');

describe('NFTAuthenticator', function () {
  beforeEach(async () => {
    await deployments.fixture(['nft_authenticator']);
    let deployment = await deployments.get('NFTAuthenticator');

    this.authenticator = await NFTAuthenticator.at(deployment.address);
  });

  it('should be deployed', async () => {
    assert.isOk(this.authenticator.address);
  });

  describe('upgradeability', () => {
    it("can't upgrade with wrong accounts", async () => {
      const { bob } = await getNamedAccounts();
      const revertMessage = 'Ownable: caller is not the owner';

      await expectRevert(this.authenticator.upgradeTo(constants.ZERO_ADDRESS, { from: bob }), revertMessage);
    });

    it('can upgrade with right account', async () => {
      const { deployer } = await getNamedAccounts();

      let newImplementation = await NFTAuthenticator.new();

      let tx = await this.authenticator.upgradeTo(newImplementation.address, { from: deployer });

      expectEvent(tx, 'Upgraded', { implementation: newImplementation.address });
    });
  });
});
