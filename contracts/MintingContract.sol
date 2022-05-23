// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interfaec for interacting with private lottery contract
interface IPrivateLottery {
    function setInitialTokenId(uint256 quantity, uint256 initial) external returns (uint256);
}

// NFT minting contract
contract MintingContract is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;
    
    // Constructor
    constructor() ERC721("ZKDropContract", "ZKDrop") {}

    // Mint function
    function mint(address privateLotteryAddress, string memory uri, uint256 quantity, uint256 initial) public onlyOwner {
        IPrivateLottery(privateLotteryAddress).setInitialTokenId(
            quantity, initial
        );
        for (uint256 i = 0; i < quantity; i++) {
            _tokenIDs.increment();
            uint256 tokenID = _tokenIDs.current();
            _safeMint(privateLotteryAddress, tokenID);
            _setTokenURI(tokenID, uri);
        }
    }

    // Burn function
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) onlyOwner {
        super._burn(tokenId);
    }

    // TokenURI containing metadata
    function tokenURI (uint256 tokenID) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenID);
    }

    // Transfer NFT
    function _transfer (address from, address to, uint256 tokenId) internal override{
        return super._transfer(from, to, tokenId);
    }
}