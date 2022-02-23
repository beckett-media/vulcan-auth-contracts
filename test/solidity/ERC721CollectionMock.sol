// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721CollectionMock is ERC721, Ownable {
    // solhint-disable-next-line
    constructor() ERC721("Collection", "MOCK") {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function ownerOf(uint256 tokenId) public view override returns (address owner) {
        // just a mock to test address 0 returns
        if (tokenId == 10) {
            return address(0);
        } else {
            return super.ownerOf(tokenId);
        }
    }
}
