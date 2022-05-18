// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.11;
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

// // Plonk verifier function (proof, public signals)
// interface IPlonkVerifier {
//     function verifyProof(bytes memory proof, uint[] memory pubSignals) external view returns (bool);
// }

// // ERC-20 transfer function (recipient, amount)
// interface IERC20 {
//     function transfer(address recipient, uint256 amount) external returns (bool);
// }

// // Lottery contract with merkle-tree inclusion proofs
// contract PrivateLottery is Ownable, Initializable {
//     // State variables
//     IERC20 public airdrop;
//     uint public amount;
//     IPlonkVerifier verifier;
//     bytes32 public root;
//     bytes32[] commitments;

//     // Map each address to nullifier -- i.e. whether user already collected airdrop
//     mapping(bytes32 => bool) public nullifierSpent;

//     // SNARK field 
//     uint256 constant SNARK_FIELD = 21888242871839275222246405745257275088548364400416034343698204186575808495617;

//     // Initalize function representing constructors deployment variables
//     function initialize (IERC20 _airdrop, uint _amount, IPlonkVerifier _verifier, bytes32 _root, bytes32[] memory _commitments) public initializer {
//         airdrop = _airdrop;
//         amount = _amount;
//         verifier = _verifier;
//         root = _root;
//         commitments = _commitments;
//     }

//     // Generate random number using block difficulty and timestamp
//     function random() private view returns (uint) {
//         return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
//     }

//     // Randomly select commitment from list of commitments as lottery winner
//     function chooseRandomCommitment (bytes32[] memory _commitments) public view returns (uint256) {
//         uint256 index = random();
//         return index;
//         // bytes32 randomCommitment = _commitments[index];
//         // return randomCommitment;
//     }

//     // Verify proof, updated nullifier set, collect airdrop
//     function collectAirdrop(bytes calldata proof, bytes32 nullifierHash) public {
//         // Check against nullifier set (i.e. nullifier hash to false)
//         require(uint256(nullifierHash) < SNARK_FIELD ,"Nullifier is not within the field");
//         require(!nullifierSpent[nullifierHash], "Airdrop already redeemed");

//         // Plonk verifier to verify proof
//         uint[] memory pubSignals = new uint[](3);
//         pubSignals[0] = uint256(root);
//         pubSignals[1] = uint256(nullifierHash);
//         pubSignals[2] = uint256(uint160(msg.sender));
//         // add another public signal for commitment chosen
//         require(verifier.verifyProof(proof, pubSignals), "Proof verification failed");

//         // Set nullifier hash to true
//         nullifierSpent[nullifierHash] = true;

//         // Transfer and collect airdrop
//         airdrop.transfer(msg.sender, amount);
//     }
// }
