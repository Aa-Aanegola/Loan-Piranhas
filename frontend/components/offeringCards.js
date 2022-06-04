import { Button, Card, CardContent, Grid, Typography } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useRouter } from 'next/router';

const OfferingCards = (props) => {

    const router = useRouter();

    const {
        amount,
        collateral,
        currentBid,
        status,
        bidEndDate,
        collateralReturnDate,
        openModal,
        setPreviousBid
    } = props;

    const bidTimeLeft = () => {
        const timeDiff = new Date(bidEndDate) - new Date();
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        return `${days}d ${hours}h ${minutes}m`
    }

    const repayTimeLeft = () => {
        const timeDiff = new Date(collateralReturnDate) - new Date();
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        return `${days}d ${hours}h ${minutes}m`
    }

    const abridgedString = () => {
        return `${collateral.slice(0, 3)}...${collateral.slice(collateral.length - 3, collateral.length)}`
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(collateral);
    }

    const getStatus = () => {
        if (status === 'L') {
            return 'Live'
        } else if (status === 'Fa') {
            return 'Failed'
        } else if (status === 'R') {
            return 'Returned'
        } else if (status === 'Fu') {
            return 'Funded'
        } else if (status === 'E') {
            return 'Expired'
        }
    }

    const getStatusClass = () => {
        if (status === 'L') {
            return {
                color: 'green'
            }
        } else if (status === 'Fa') {
            return {
                color: 'red'
            }
        } else if (status === 'R') {
            return {
                color: 'red'
            }
        } else if (status === 'Fu') {
            return {
                color: 'green'
            }
        } else if (status === 'E') {
            return {
                color: 'gray'
            }
        }
    }

    const checkAmountRepayable = () => {
        const currDate = new Date();
        const repayDate = new Date(collateralReturnDate);
        if (status === 'Fu' && currDate < repayDate) {
            return true
        }
        return false
    }

    const handleBid = () => {
        setPreviousBid(currentBid);
        openModal(true)
    }


    return (
        <div>

            {status === 'L' && <Card style={{ maxWidth: "400px", margin: "10px 0" }} className="card">
                <CardContent>
                    <Grid container>
                        <Grid item xs={12}>
                            <p className="grid-p"><span style={{ fontWeight: "500" }}>Req. Amount: </span>{amount}</p>
                        </Grid>
                        <Grid item xs={12}>
                            <p className="grid-p" onClick={copyToClipboard}><span style={{ fontWeight: "500" }}>Collateral: </span><span className="click2Copy">{abridgedString()} <ContentCopyIcon style={{ fontSize: "15px" }} /></span></p>
                        </Grid>
                        <Grid item xs={12}>
                            <p className="grid-p"><span style={{ fontWeight: "500" }}>Current Bid: </span>{currentBid}</p>
                        </Grid>
                        <Grid item xs={12}>
                            <p className="grid-p"><span style={{ fontWeight: "500" }}>Status: </span><span style={getStatusClass()}>{getStatus()}</span></p>
                        </Grid>
                        {
                            status === 'L' ?
                                <Grid item xs={12}>
                                    <p className="grid-p"><span style={{ fontWeight: "500" }}>Bidding time left: </span>{bidTimeLeft()}</p>
                                </Grid> : (status === 'Fu' ?
                                    <Grid item xs={12}>
                                        <p className="grid-p"><span style={{ fontWeight: "500" }}>Time Left to Repay: </span>{repayTimeLeft()}</p>
                                    </Grid> : null)
                        }
                        <Grid item xs={12}>
                            <Button variant="contained" style={{ fontSize: "15px" }} onClick={handleBid} fullWidth>Make Bid</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>}
        </div>
    )
}

export default OfferingCards;