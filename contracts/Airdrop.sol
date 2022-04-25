// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

// Call Plonk verifier function, passing in [1] proof, [2] set of public signals
interface IPlonkVerifier {
    function verifyProof(bytes memory proof, uint[] memory pubSignals) external view returns (bool);
}

// ERC-20 transfer function
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

// Airdrop contract with merkle-tree inclusion zk-proofs
contract Airdrop is Ownable {
    // ERC-20 token
    IERC20 public airdropToken;
    // Airdrop amount per eligible reciever
    uint public amountPerRedemption;
    // Plonk verifier
    IPlonkVerifier verifier;

    // Merkle tree root of commitments
    bytes32 public root;

    // map each address to nullifier (whether or not they recieved airdrop)
    mapping(bytes32 => bool) public nullifierSpent;

    // SNARK field operating over
    uint256 constant SNARK_FIELD = 21888242871839275222246405745257275088548364400416034343698204186575808495617;

    // constructor includes address of erc-20 token, amount of token, address of verifier, and roothash
    constructor(
        IERC20 _airdropToken,
        uint _amountPerRedemption,
        IPlonkVerifier _verifier,
        bytes32 _root
    ) {
        airdropToken = _airdropToken;
        amountPerRedemption = _amountPerRedemption;
        verifier = _verifier;
        root = _root;
    }

    // Verify proof, add address to nullifier set, collect airdrop
    function collectAirdrop(bytes calldata proof, bytes32 nullifierHash) public {
        // Check against nullifier set (i.e. nullifier hash to false)
        require(uint256(nullifierHash) < SNARK_FIELD ,"Nullifier is not within the field");
        require(!nullifierSpent[nullifierHash], "Airdrop already redeemed");

        // Call Plonk verifier to verify proof
        uint[] memory pubSignals = new uint[](3);
        pubSignals[0] = uint256(root);
        pubSignals[1] = uint256(nullifierHash);
        pubSignals[2] = uint256(uint160(msg.sender));
        require(verifier.verifyProof(proof, pubSignals), "Proof verification failed");

        // Set nullifier hash to true
        nullifierSpent[nullifierHash] = true;

        // Transfer and collect airdrop
        airdropToken.transfer(msg.sender, amountPerRedemption);
    }

    // Mutable function allowing owner to update state root
    function updateRoot(bytes32 newRoot) public onlyOwner {
        root = newRoot;
    }
}