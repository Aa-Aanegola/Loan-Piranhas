import CustomNavbar from '../../components/navbar';
import OfferingCards from '../../components/offeringCards';
import { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import { ethers } from "ethers";
import BidModal from '../../components/bidModal';
let data = require('/data/dashboardData.json');

let Contract = require('../../../smart_contracts/artifacts/contracts/AssetNFT.sol/AssetNFT.json');

const Offerings = () => {
    const [balance, setBalance] = useState(0);
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [previousBid, setPreviousBid] = useState(0);
    // const [showModal, setShowModal] = useState(false);

    const getBalance = async (ethProvider) => {
        const balance = await ethProvider.getBalance(localStorage.getItem("account"));
        setBalance(ethers.utils.formatEther(balance));
    }

    useEffect(() => {
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        getBalance(ethProvider);
        setItems([...data.filter(item => item.status === "L")]);
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
        setShowModal(false);
    }

    const openModal = () => {
        setShowModal(true)
    }

    return (
        <div>
            <BidModal open={showModal} setOpen={setShowModal} previousBid={previousBid} />
            <CustomNavbar />
            <div>
                <Grid container>
                    <Grid item xs={6}>
                        <div>
                            <h1 style={{ padding: "20px" }}>Balance: {balance} eth</h1>
                        </div>
                    </Grid>
                </Grid>
            </div>
            <div className="main" style={{ paddingTop: "0" }}>
                <h1>
                    All Offerings
                </h1>
                <Grid container>
                    {
                        items.map((item, index) => {
                            return (
                                <Grid item xs={3} key={index}>
                                    <div className="grid-card">
                                        <OfferingCards {...item} setPreviousBid={setPreviousBid} openModal={openModal} />
                                    </div>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </div>
        </div>
    );
}

export default Offerings