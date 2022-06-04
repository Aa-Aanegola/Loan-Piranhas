const { ethers } = require('hardhat');

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const BIDDER_ADDRESS = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
const LENDER_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const BORROWER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";


const provider = new ethers.providers.JsonRpcProvider();

const main = async () => {
    console.log(`Contract Address: ${ethers.utils.formatEther(await provider.getBalance(CONTRACT_ADDRESS))} ethers`);
    console.log(`Bidder Address: ${ethers.utils.formatEther(await provider.getBalance(BIDDER_ADDRESS))} ethers`);
    console.log(`Lender Address: ${ethers.utils.formatEther(await provider.getBalance(LENDER_ADDRESS))} ethers`);
    console.log(`Borrower Address: ${ethers.utils.formatEther(await provider.getBalance(BORROWER_ADDRESS))} ethers`);
}

main();