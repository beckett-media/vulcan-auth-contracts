// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./Structs.sol";

/**
 * @title Smart contract where authentication data is stored
 * @dev This contract is upgradeable through UUPS (EIP-1822), and the
 *      the upgrader is the owner of the contract (ownership can be transferred)
 */
contract NFTAuthenticator is UUPSUpgradeable, AccessControlUpgradeable {
    /* solhint-disable no-empty-blocks */

    // roles
    bytes32 private constant UPGRADER = keccak256("UPGRADER");
    bytes32 private constant AUTHENTICATOR = keccak256("AUTHENTICATOR");

    /**
     * @dev The two posible state of an NFT
     * @param UNAUTHENTICATED Whether the NFT has not been authenticated yet
     * @param AUTHENTICATED Whether the NFT has been authenticated already
     */
    enum NFTStates {
        UNAUTHENTICATED,
        AUTHENTICATED
    }

    /**
     * @dev A mapping to store the current state of one NFT by protocolId
     *      (protocolId = keccak256(abi.encode(collection, tokenId)))
     */
    mapping(bytes32 => NFTStates) private _nftAuthenticationState;

    /**
     * @dev emitted when owner authenticates ERC721 tokens
     * @param tokens the tokens to authenticate
     * @param statuses whether the tokens (by index) were authenticated or not
     */
    event ERC721TokensAuthenticated(ERC721Token[] tokens, bool[] statuses);

    /**
     * @dev The initializer modifier is to avoid someone initializing
     *      the implementation contract after deployment (see proxy pattern for upgrades)
     */
    constructor() initializer {}

    /**
     * @dev Initializes the contract (makes the deployer the owner by default)
     */
    function initialize() external initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        // give all the power to the deployer to select who can control the contract
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER, msg.sender);
        _grantRole(AUTHENTICATOR, msg.sender);
    }

    /**
     * @notice getter to query if a token is authenticated
     * @dev returns false if the token was burned
     * @param token_ the information of the token to query (collection and token id)
     * @return authenticated whether the token is authenticated or not
     */
    function isAuthenticated(ERC721Token calldata token_) external view returns (bool authenticated) {
        // validate existence of the token
        if (!_exists(token_)) {
            return false;
        }

        bytes32 protocolId = keccak256(abi.encode(token_.collection, token_.tokenId));

        return _nftAuthenticationState[protocolId] == NFTStates.AUTHENTICATED;
    }

    /**
     * @notice Allows authentication in batches of ERC721 NFTs
     * @dev The token should exists to be authenticated
     * @param tokens_ The list of tokens to be potentially authenticated
     */
    function authenticateERC721Tokens(ERC721Token[] calldata tokens_) external onlyRole(AUTHENTICATOR) {
        require(tokens_.length > 0, "Empty list");

        // an array of statuses (whether the token could be authenticated or not)
        bool[] memory statuses = new bool[](tokens_.length);

        // validate and authenticate each token
        for (uint256 i; i < tokens_.length; i++) {
            ERC721Token memory current = tokens_[i];

            // tries to authenticate the token validating existence
            bool wasAuthenticated = _authenticate(current);
            statuses[i] = wasAuthenticated;
        }

        emit ERC721TokensAuthenticated(tokens_, statuses);
    }

    /**
     * @dev Internal helper for authentications.
     *      If the token exists save the state to the storage and returns true.
     *      Returns false otherwise.
     * @param token_ The information of the token (collection and tokenId)
     * @return authenticated Whether the token could be authenticated or not
     */
    function _authenticate(ERC721Token memory token_) internal returns (bool authenticated) {
        // validate existence of the token
        if (!_exists(token_)) {
            return false;
        }

        // if the token exists authenticate it
        bytes32 protocolId = keccak256(abi.encode(token_.collection, token_.tokenId));
        _nftAuthenticationState[protocolId] = NFTStates.AUTHENTICATED;

        return true;
    }

    /**
     * @dev Internal helper for checking token existence.
     * @param token_ The information of the token (collection and tokenId)
     * @return exists whether the token exists or not
     */
    function _exists(ERC721Token memory token_) internal view returns (bool exists) {
        // validate existence of the token
        // (try to get the owner from the collection)
        try IERC721(token_.collection).ownerOf(token_.tokenId) returns (address owner) {
            if (owner == address(0)) {
                return false;
            }
        } catch {
            return false;
        }

        return true;
    }

    /// @dev Override to validate ownership when attempting to upgrade
    function _authorizeUpgrade(address) internal view override onlyRole(UPGRADER) {}
}
