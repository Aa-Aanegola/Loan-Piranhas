const { ethers } = require('hardhat');
const contract = require('../artifacts/contracts/LoanRequest.sol/LoanRequest.json');


const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

const provider = new ethers.providers.JsonRpcProvider();
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const loanRequestContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const main = async () => {

    console.log("Staking collateral...");

    try {
        const tx = await loanRequestContract.stake();
        await tx.wait();
        console.log("Asset Staked!");
    }
    catch (e) {
        console.log(e);
    }
}

main();