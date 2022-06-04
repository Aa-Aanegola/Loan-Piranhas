const { ethers } = require('hardhat');
const contract = require('../artifacts/contracts/AssetNFT.sol/AssetNFT.json');

const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new ethers.providers.JsonRpcProvider();
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const assetNFTContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const main = async () => {

    const owner = await assetNFTContract.ownerOf(1);
    console.log(`Owner: ${owner}`);

}
main();