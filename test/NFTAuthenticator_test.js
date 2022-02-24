const NFTAuthenticator = artifacts.require('NFTAuthenticator');
const ERC721CollectionMock = artifacts.require('ERC721CollectionMock');

const { expectRevert, expectEvent, constants } = require('@openzeppelin/test-helpers');

describe('NFTAuthenticator', function () {
  beforeEach(async () => {
    await deployments.fixture(['nft_authenticator', 'erc721_collection_mock']);

    let deployment = await deployments.get('NFTAuthenticator');
    this.authenticator = await NFTAuthenticator.at(deployment.address);

    deployment = await deployments.get('ERC721CollectionMock');
    this.collection = await ERC721CollectionMock.at(deployment.address);
  });

  it('should be deployed', async () => {
    assert.isOk(this.authenticator.address);
  });

  describe('authentication', () => {
    it("can't authenticate from non-owner account", async () => {
      const { bob } = await getNamedAccounts();

      await expectRevert.unspecified(this.authenticator.authenticateERC721Tokens([], { from: bob }));
    });

    it("can't authenticate empty list", async () => {
      const revertMessage = 'Empty list';

      await expectRevert(this.authenticator.authenticateERC721Tokens([]), revertMessage);
    });

    it('can authenticate one token (non-existent)', async () => {
      const tokens = [{ collection: this.collection.address, tokenId: 5 }];

      let tx = await this.authenticator.authenticateERC721Tokens(tokens);

      expectEvent(tx, 'ERC721TokensAuthenticated', { statuses: [false] });
    });

    it('can authenticate one token (existent)', async () => {
      const { deployer } = await getNamedAccounts();

      // mint token with id 1
      this.collection.safeMint(deployer, 1);

      const tokens = [{ collection: this.collection.address, tokenId: 1 }];

      let tx = await this.authenticator.authenticateERC721Tokens(tokens);

      expectEvent(tx, 'ERC721TokensAuthenticated', { statuses: [true] });
    });

    describe('isAuthenticated getter', () => {
      beforeEach(async () => {
        const { deployer } = await getNamedAccounts();

        this.tokens = [{ collection: this.collection.address, tokenId: 1 }];

        // mint token with id 1
        this.collection.safeMint(deployer, 1);
        await this.authenticator.authenticateERC721Tokens(this.tokens);
      });

      it('can get if a token is authenticated (when it is)', async () => {
        // get the first token
        const token = this.tokens[0];

        let authenticated = await this.authenticator.isAuthenticated(token);

        assert.strictEqual(authenticated, true);
      });

      it('can get if a token is authenticated (when it is not)', async () => {
        // get the first token
        let token = this.tokens[0];

        // change the token id
        token.tokenId = 2;

        let authenticated = await this.authenticator.isAuthenticated(token);

        assert.strictEqual(authenticated, false);
      });

      it('test address(0) in the _exists getter', async () => {
        // get the first token
        let token = this.tokens[0];

        // change the token id
        token.tokenId = 10;

        let authenticated = await this.authenticator.isAuthenticated(token);

        assert.strictEqual(authenticated, false);
      });
    });
  });

  describe('upgradeability', () => {
    it("can't upgrade with wrong accounts", async () => {
      const { bob } = await getNamedAccounts();

      await expectRevert.unspecified(this.authenticator.upgradeTo(constants.ZERO_ADDRESS, { from: bob }));
    });

    it('can upgrade with right account', async () => {
      const { deployer } = await getNamedAccounts();

      let newImplementation = await NFTAuthenticator.new();

      let tx = await this.authenticator.upgradeTo(newImplementation.address, { from: deployer });

      expectEvent(tx, 'Upgraded', { implementation: newImplementation.address });
    });
  });
});
