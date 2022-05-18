## Execute all scripts and set up environment

sh scripts/0_plonk.sh
npx hardhat run scripts/1_deploy_old.ts --network localhost
sh scripts/2_frontendDependencies.sh