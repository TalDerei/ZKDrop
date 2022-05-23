## Execute all scripts and set up environment

sh scripts/0_plonk.sh
npx hardhat run scripts/1_commitments.ts --network localhost
npx hardhat run scripts/2_deploy.ts --network localhost
sh scripts/3_frontendDependencies.sh