const { ethers } = require('hardhat');
const contract = require('../artifacts/contracts/AssetNFT.sol/AssetNFT.json');

const PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new ethers.providers.JsonRpcProvider();
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const assetNFTContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const main = async () => {

    const address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const metadataURL = "llama.jpg";

    console.log(`Adding token to ${address}`);
    try {
        const tx = await assetNFTContract.mintNFT(address, metadataURL);
        const res = await tx.wait();
        console.log("Minted NFT");

        console.log(`Token ID: ${res.logs[0].topics[3]}`);
    }
    catch (e) {
        console.log(e);
    }

}

main();