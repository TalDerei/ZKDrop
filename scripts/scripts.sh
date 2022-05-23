## Execute all scripts and set up environment

sh scripts/0_plonk.sh
npx hardhat run scripts/3_commitments.ts --network testnet
npx hardhat run scripts/1_deploy.ts --network testnet
sh scripts/2_frontendDependencies.sh