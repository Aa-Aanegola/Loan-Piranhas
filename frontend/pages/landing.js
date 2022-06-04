import { Button, Grid } from "@mui/material";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Landing = () => {

    const router = useRouter()

    const connectWallet = async () => {
        try {
            const res = await ethereum.request({ method: 'eth_requestAccounts' });
            localStorage.setItem('account', res[0])
            router.push('/dashboard')
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="container">
            <Grid container className="main">
                <Grid item>
                    <img alt="Meta Mask logo" src={`/assets/metamask-630903.png`} width="100px" />
                </Grid>
                <Grid item>
                    <Button onClick={connectWallet} variant="contained" style={{ backgroundColor: "orange", fontSize: "15px", margin: '10px' }}>Connect Wallet</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default Landing;