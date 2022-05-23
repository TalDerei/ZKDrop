#!/bin/bash

## Groth16 Script

# Build withdraw.circom and merkleTree.circom circuits
TARGET_CIRCUIT=../../circuits/circuit.circom
PTAU_FILE=./pot12_final.ptau
ENTROPY_FOR_ZKEY=ksmdksmksdmk
mkdir -p ../build/circuits
cd ../build/circuits

## Generate circuit.r1cs & circuit.sym & circuit.wasm
echo 'Generating circuit.r1cs & circuit.sym & circuit.wasm'
circom $TARGET_CIRCUIT --r1cs circuit.r1cs --wasm circuit.wasm --sym circuit.sym

## Start Powers of Tau ceremony (Trusted Ceremony)
snarkjs powersoftau new bn128 16 pot12_0000.ptau -v

## Contribute to ceremony by adding entropy
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v

## Generate circuit_0000.zkey
echo "Generating circuit_0000.zkey"
snarkjs zkey new circuit.r1cs $PTAU_FILE circuit_0000.zkey

## Generate circuit_final.zkey
echo "Generating circuit_final.zkey"
echo $ENTROPY_FOR_ZKEY | snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey

## Generate verification_key.json
echo "Generating verification_key.json"
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json

## Build verifier.sol
echo 'Generating verifier.sol'
cd ../../contracts/

if [ -f ../build/circuits/circuit_final.zkey ]; then

  snarkjs zkey export solidityverifier ../scripts/build/circuits/circuit_final.zkey Verifier.sol
  [ $? -eq 0 ] && echo "success: ./contracts/Verifier.sol"

else
  echo "Fail: circuit_final.zkey not found"