async function main() {

    const LoanRequest = await ethers.getContractFactory("LoanRequest");
    const loanRequest = await LoanRequest.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", ethers.utils.parseEther("1"), 1);
    await loanRequest.deployed();

    console.log("Contract deployed to address:", loanRequest.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });