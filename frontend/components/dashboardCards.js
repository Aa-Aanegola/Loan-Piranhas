import { Button, Card, CardContent, Grid, Typography } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useRouter } from 'next/router';

const DashboardCards = (props) => {

    const router = useRouter();

    const {
        principalAmount,
        collateral,
        interest,
        status,
        bidEndDate,
        collateralReturnDate, 
        bidInProgress
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
        return `${collateral}`
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(collateral);
    }

    const getStatus = () => {
        if (bidInProgress == true) {
            return 'Live'
        } else
            return 'Inactive'
    }

    const getStatusClass = () => {
        if (bidInProgress) {
            return {
                color: 'green'
            }
        } else {
            return {
                color: 'red'
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

    const handleRepay = () => {
        console.log("repay")
    }

    return (
        <Card style={{ maxWidth: "400px", margin: "10px 0" }} className="card">
            <CardContent>
                <Grid container>
                    <Grid item xs={12}>
                        <p className="grid-p"><span style={{ fontWeight: "500" }}>Req. Amount: </span>{principalAmount}</p>
                    </Grid>
                    <Grid item xs={12}>
                        <p className="grid-p" onClick={copyToClipboard}><span style={{ fontWeight: "500" }}>Collateral: </span><span className="click2Copy">{abridgedString()} <ContentCopyIcon style={{ fontSize: "15px" }} /></span></p>
                    </Grid>
                    <Grid item xs={12}>
                        <p className="grid-p"><span style={{ fontWeight: "500" }}>Current Bid: </span>{interest}</p>
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
                    {
                        checkAmountRepayable() &&
                        <Grid item xs={12}>
                            <Button variant="contained" style={{ backgroundColor: "orange", fontSize: "15px" }} onClick={handleRepay} fullWidth>Repay</Button>
                        </Grid>
                    }
                </Grid>
            </CardContent>
        </Card>
    )
}

export default DashboardCards;