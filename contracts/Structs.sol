// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @dev this is a struct representing an ERC721 token
 * @param collection the address of the ERC721 collection smart contract
 * @param tokenId the id of the token inside the collection
 */
struct ERC721Token {
    address collection;
    uint256 tokenId;
}
