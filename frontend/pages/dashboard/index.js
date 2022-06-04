import { ContractFactory, ethers } from "ethers";
import CustomNavbar from "../../components/navbar";
import { CircularProgress } from '@mui/material';
import { useState, useEffect } from "react";
import DashboardCards from "../../components/dashboardCards";
import { Button, Grid } from "@mui/material";
import AddListingModal from '../../components/addListingModal';
import GraphQLClient from 'graphql-client';
let data = require("/data/dashboardData.json");
let LoanRequest = require("../../../smart_contracts/artifacts/contracts/LoanRequest.sol/LoanRequest.json");

let Contract = require('../../../smart_contracts/artifacts/contracts/AssetNFT.sol/AssetNFT.json');
const smartContractAddress = '0x36ad10998708f8020572854572319358EA250aCC'


const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [NFTs, setNFTs] = useState(null);

    const getBalance = async (ethProvider) => {
        const balance = await ethProvider.getBalance(localStorage.getItem("account"));
        setBalance(ethers.utils.formatEther(balance));
    }

    useEffect(() => {
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        getBalance(ethProvider);
        const getNFTData = async () => {
            const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = ethProvider.getSigner();
            const contract = new ethers.Contract(smartContractAddress, Contract.abi, signer);

            const tokenIds = await contract.getTokensOfAddress(signer.getAddress());
            const tokenURIs = await Promise.all(tokenIds.map(async (tokenId) => await contract.tokenURI(tokenId)));
            
            setNFTs(tokenIds.map(id => id.toString()));
        }
        const getListings = async () => {
            const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = ethProvider.getSigner();
            const address = await signer.getAddress();
            const query = `
            query MyQuery {
                transactions(where: {borrower: "${address}"}) {
                  principalAmount
                  collateral
                  interest
                  bidInProgress
                }
              }
                           
            `;
            const client = new GraphQLClient({url:"https://api-ap-south-1.graphcms.com/v2/cl3pq3iqv7fcn01z6bn7whqqw/master",
                headers: {
                    Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NTM3ODQxNDQsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmdyYXBoY21zLmNvbS92Mi9jbDNwcTNpcXY3ZmNuMDF6NmJuN3docXF3L21hc3RlciIsImh0dHBzOi8vbWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQuZ3JhcGhjbXMuY29tLyIsInN1YiI6ImVjMmMzOThjLTBlNDgtNDk3NS04MDczLWQxMjA5N2Y2NjlhMSIsImp0aSI6ImNsM3FrZG9qdDhhem8wMXhpNHBrcjJvZGMifQ.atq9IUmnaNH7xnjITPQ4hgkNBZJjY1B1pIwpvuELvFmJF54wdBNe_nLq5Z79WSDZlJCi4U4PXck2XAMoOSWPErhT7Y4oUfUMZSW1aKwcswj7u5PyF0q-yFafE9MBfVGbflZnMgpqjfUAm__SqeLICFfSgl4nwN2wBAZGMcr-bn0M9l0fDjs43aKMrmuHWZpD8bot5tcbZrBJ0e23j3cwiar2cuwF_-yCteruZ_X77YTpyf0k5V3wYpR-shwnn9zGcYaEJJqA5yzVuVKSUoJhX9CGzAngCRZdNuFqR7okNBUPmBXPMU_g1iGnrUYodEP57Phq49W-3a_ImPCsz8Aj8R6pOTsmPISrf-0JMx-dNp6ZquQoEor5whuZkE8RNWWJrg-KciSmPOl1tjqQUQAJKCusQpPEqA7ymOgVmOJKTxr5gpaiXTw7C0MYTTM2SsFFgPYquu-xcJZiyXPNumbUDNYHk2K06W4RSCDHO5XsHs3upSXsQeOYS7nlKnzQr_NH79KFSaHZJJD30QknjjbOehk-Mk-iDNfCajg28xVjxVvE3Z4mUTabE14r1VzDXK3e5fHOwoUzNvPBiR5_RRiqdsd1tVZ4CRm2AXzWSf8CtV_nZawLJTqmUk1N3z9E_sYy5VCp3SpTWVlvyQBzkOe372REGheky_N7oGBTKyihVpQ`,
                },
            });
        const res = await client.query(query);
        setItems(res.data.transactions);

        }
        getNFTData();
        getListings();
    }, [])

    const handleModalOpen = () => {
        setShowModal(true);
    }

    const handleAddition = async (amount, collateral, lastBidDate, lastPayDate, maxAcceptableBid) => {
        const newItem = {
            amount,
            collateral,
            lastBidDate,
            lastPayDate,
            maxAcceptableBid,
            status: "L"
        }
        setItems([...items, newItem]);

        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = ethProvider.getSigner();
        const address = await signer.getAddress();

        setLoading(true);
        const LoanRequestFac = await new ContractFactory(LoanRequest.abi, LoanRequest.bytecode, signer);
        const loanRequest = await LoanRequestFac.deploy(address, amount, 1);
        await loanRequest.deployed();
        console.log("Contract deployed to address:", loanRequest.address);

        const mutation = `
        mutation () {
            createTransaction(
            data: {
                borrower: "${address}"
                principalAmount: ${Number(amount)}
                collateral: "${collateral}"
                bidInProgress: true
                transactionCompleted: false
            }
            ) {
            id
            }
        }
        `;
        console.log(mutation);
        const client = new GraphQLClient({url:"https://api-ap-south-1.graphcms.com/v2/cl3pq3iqv7fcn01z6bn7whqqw/master",
            headers: {
                Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NTM3ODQxNDQsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmdyYXBoY21zLmNvbS92Mi9jbDNwcTNpcXY3ZmNuMDF6NmJuN3docXF3L21hc3RlciIsImh0dHBzOi8vbWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQuZ3JhcGhjbXMuY29tLyIsInN1YiI6ImVjMmMzOThjLTBlNDgtNDk3NS04MDczLWQxMjA5N2Y2NjlhMSIsImp0aSI6ImNsM3FrZG9qdDhhem8wMXhpNHBrcjJvZGMifQ.atq9IUmnaNH7xnjITPQ4hgkNBZJjY1B1pIwpvuELvFmJF54wdBNe_nLq5Z79WSDZlJCi4U4PXck2XAMoOSWPErhT7Y4oUfUMZSW1aKwcswj7u5PyF0q-yFafE9MBfVGbflZnMgpqjfUAm__SqeLICFfSgl4nwN2wBAZGMcr-bn0M9l0fDjs43aKMrmuHWZpD8bot5tcbZrBJ0e23j3cwiar2cuwF_-yCteruZ_X77YTpyf0k5V3wYpR-shwnn9zGcYaEJJqA5yzVuVKSUoJhX9CGzAngCRZdNuFqR7okNBUPmBXPMU_g1iGnrUYodEP57Phq49W-3a_ImPCsz8Aj8R6pOTsmPISrf-0JMx-dNp6ZquQoEor5whuZkE8RNWWJrg-KciSmPOl1tjqQUQAJKCusQpPEqA7ymOgVmOJKTxr5gpaiXTw7C0MYTTM2SsFFgPYquu-xcJZiyXPNumbUDNYHk2K06W4RSCDHO5XsHs3upSXsQeOYS7nlKnzQr_NH79KFSaHZJJD30QknjjbOehk-Mk-iDNfCajg28xVjxVvE3Z4mUTabE14r1VzDXK3e5fHOwoUzNvPBiR5_RRiqdsd1tVZ4CRm2AXzWSf8CtV_nZawLJTqmUk1N3z9E_sYy5VCp3SpTWVlvyQBzkOe372REGheky_N7oGBTKyihVpQ`,
            },
        });
        const res = await client.query(mutation);
        console.log(res);

        setLoading(false);
        setShowModal(false);
    }


    return (
        <div>
        {loading?
        <>
        <h1>Creating loan</h1>
        <CircularProgress/>
        </> :
        <>
            <AddListingModal handleAddition={handleAddition} open={showModal} setOpen={setShowModal} walletNFTs={NFTs} />
            <CustomNavbar />
            <div>
                <Grid container>
                    <Grid item xs={6}>
                        <div>
                            <h1 style={{ padding: "20px" }}>Balance: {balance} eth</h1>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="grid-card">
                            <Button variant="contained" style={{ backgroundColor: "orange", fontSize: "15px", margin: '10px' }} onClick={handleModalOpen}>Add Item</Button>
                        </div>
                    </Grid>
                </Grid>
            </div>
            <div className="main">
                <h1>
                    My Loan Requests
                </h1>
                <Grid container>
                    {
                        items.map((item, index) => {
                            return (
                                <Grid item xs={3} key={index}>
                                    <div className="grid-card">
                                        <DashboardCards {...item} />
                                    </div>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </div>
        
        </>
         }
        </div>
    );
}

export default Dashboard