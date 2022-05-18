## Plonk circuit

# Compile circuit.circom circuit 
circom ./circuits/circuit.circom --sym --wasm --r1cs -o ./build

# # Reload profile 
source ~/.profile

# Generate verification key based on Hermez 'Powers of Tau' MPC Ceremony
snarkjs plonk setup ./build/circuit.r1cs ./build/powersOfTau28_hez_final_16.ptau ./build/circuit_final.zkey

# Generate 'MerkVerifier.sol' solidity verification smart contract
snarkjs zkey export solidityverifier ./build/circuit_final.zkey ./contracts/compiled/MerkVerifier.sol

# Add circuit_final.zkey and circuit.wasm to be accessible by frontend code
cp ./build/circuit_final.zkey ./frontend/public/ 
cp ./build/circuit_js/circuit.wasm ./frontend/public/ 