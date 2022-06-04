// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./AssetNFT.sol";

contract LoanRequest {
    AssetNFT public collateralContract;
    enum LoanStatus {
        LIVE,
        FUNDED,
        EXPIRED,
        COMPLETED,
        FAILED
    }

    // Loan Information
    address payable borrower;
    uint256 requestAmount;
    uint256 collateralId;
    LoanStatus status;

    // Bid Information
    address payable lender;
    uint256 interestAmount;

    // STATIC
    address payable NULL_ADDRESS;

    constructor(
        address payable _borrower,
        uint256 _requestAmount,
        uint256 _assetId
    ) {
        collateralContract = AssetNFT(
            0x5FbDB2315678afecb367f032d93F642f64180aa3
        );
        borrower = _borrower;
        requestAmount = _requestAmount;
        collateralId = _assetId;
        status = LoanStatus.LIVE;

        // Max uint256
        interestAmount = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    }

    function stake() public {
        require(msg.sender == borrower, "Only Borrower Can Stake Collateral");
        collateralContract.safeTransferFrom(
            borrower,
            address(this),
            collateralId
        );
    }

    function bid(uint256 _interestAmount) public payable {
        require(
            msg.value == requestAmount,
            "Please send the right amount of Ether"
        );
        require(
            _interestAmount < interestAmount,
            "Need to provide a better bid"
        );
        require(
            status == LoanStatus.LIVE,
            "The loan is not currently accepting any bids"
        );

        transferFunds(lender, requestAmount);
        lender = payable(msg.sender);
        interestAmount = _interestAmount;
    }

    function transferFunds(address payable receiver, uint256 amount) private {
        if (receiver != NULL_ADDRESS) receiver.transfer(amount);
    }

    function acceptLoanTerms() public {
        require(
            msg.sender == borrower,
            "Terms can only be accepted by the borrower"
        );

        if (lender == NULL_ADDRESS) {
            status = LoanStatus.EXPIRED;
            collateralContract.safeTransferFrom(
                address(this),
                borrower,
                collateralId
            );
        } else {
            status = LoanStatus.FUNDED;
            transferFunds(borrower, requestAmount);
        }
    }

    function terminateLoan() public payable {
        require(
            msg.sender == lender || msg.sender == borrower,
            "Only Borrower or Lender can Terminate the Contract"
        );
        // Payed back
        if (msg.sender == borrower) {
            require(
                msg.value >= requestAmount + interestAmount,
                "Need to return principle amount and interest"
            );

            // Send money to the lender
            transferFunds(lender, requestAmount + interestAmount);

            // Send collateral to the borrower
            collateralContract.safeTransferFrom(
                address(this),
                borrower,
                collateralId
            );

            status = LoanStatus.COMPLETED;
        }
        // Not payed back
        else {
            collateralContract.safeTransferFrom(
                address(this),
                lender,
                collateralId
            );
            status = LoanStatus.FAILED;
        }
    }

    function balanceOf() external view returns (uint256) {
        return address(this).balance;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) public virtual returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
