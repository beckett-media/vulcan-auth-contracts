const NFTAuthenticator = artifacts.require('NFTAuthenticator');

describe('NFTAuthenticator', function () {
  beforeEach(async () => {
    await deployments.fixture(['nft_authenticator']);
    let deployment = await deployments.get('NFTAuthenticator');

    this.authenticator = await NFTAuthenticator.at(deployment.address);
  });

  it('should be deployed', async () => {
    assert.isOk(this.authenticator.address);
  });
});
