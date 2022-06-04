async function main() {
  const AssetNFT = await ethers.getContractFactory("AssetNFT");

  // Start deployment, returning a promise that resolves to a contract object
  const assetNFT = await AssetNFT.deploy();
  await assetNFT.deployed();
  console.log("Contract deployed to address:", assetNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  });