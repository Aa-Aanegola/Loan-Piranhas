const { ethers } = require('hardhat');
const contract = require('../artifacts/contracts/LoanRequest.sol/LoanRequest.json');


const PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

const provider = new ethers.providers.JsonRpcProvider();
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const loanRequestContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const main = async () => {

    console.log(`Wallet Balance: ${ethers.utils.formatEther(await signer.getBalance())}`);
    console.log("Placing Bid");
    try {
        const tx = await loanRequestContract.bid(ethers.utils.parseEther("0.1"), { value: ethers.utils.parseEther("1") });
        await tx.wait();
        console.log("Placed bid");
    }
    catch (e) {
        console.log(e);
    }
    console.log(`Wallet Balance: ${ethers.utils.formatEther(await signer.getBalance())}`);

}

main();