const { ethers } = require('hardhat');

const main = async () => {

    const AssetNFT = await ethers.getContractFactory('AssetNFT');

    const assetNFT = await AssetNFT.deploy();

    console.log(`Contract has been deployed to ${assetNFT.address}`);

};

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.log(e);
        process.exit(1);
    });