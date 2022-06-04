import { Container, Grid } from "@mui/material"

const Install = () => {
    return (
        <Container>
            <Grid container className="main">
                <Grid item xs={12}>
                    <img alt="Meta Mask logo" src={`/assets/metamask-630903.png`} width="100px"/>
                </Grid>
                <Grid item xs={12}>
                    <h2>Please install <a href="https://metamask.io/download.html" style={{color:"orange", textDecoration:"underline"}}>MetaMask</a> to use this website.</h2>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Install;