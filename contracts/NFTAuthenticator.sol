// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @title Smart contract where authentication data is stored
 * @dev This contract is upgradeable through UUPS (EIP-1822), and the
 *      the upgrader is the owner of the contract (ownership can be transferred)
 */
contract NFTAuthenticator is UUPSUpgradeable, OwnableUpgradeable {
    /* solhint-disable no-empty-blocks */

    /**
     * @dev The initializer modifier is to avoid someone initializing
     *      the implementation contract after deployment (see proxy pattern for upgrades)
     */
    constructor() initializer {}

    /**
     * @dev Initializes the contract (makes the deployer the owner by default)
     */
    function initialize() external initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    /// @dev override to validate ownership when attempting to upgrade
    function _authorizeUpgrade(address) internal view override onlyOwner {}
}
