const { ethers } = require('hardhat');

const { API_KEY, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;
const contract = require('../artifacts/contracts/LoanCollateral.sol/LoanCollateral.json');

const provider = new ethers.providers.JsonRpcProvider();
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const loanCollateralContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const addNFTToAccount = async (address, metadataURL) => {

    console.log("Minting NFT");
    try {
        const tx = await loanCollateralContract.mintNFT(address, metadataURL);
        const res = await tx.wait();
        console.log("Minted NFT");

        console.log(res.logs[0].topics);
    }
    catch (e) {
        console.log(e);
    }

};

const getIssuedNFTCount = async () => {
    return await loanCollateralContract.totalSupply();
};

const getOwner = async (tokenId) => {
    return await loanCollateralContract.ownerOf(tokenId);
};

const getURI = async (tokenId) => {
    return await loanCollateralContract.tokenURI(tokenId);
}

const main = async () => {
    await addNFTToAccount("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "lmao.jpg");

}

main();