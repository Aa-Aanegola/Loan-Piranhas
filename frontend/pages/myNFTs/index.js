import { ethers } from "ethers";
import { useState, useEffect } from 'react';
import { TextField, CircularProgress, Card, CardContent, CardMedia, Typography } from '@mui/material';
import CustomNavbar from '../../components/navbar';
import { Button } from '@mui/material'
import FileBase64 from 'react-file-base64';
import GraphQLClient from 'graphql-client';
import swal from 'sweetalert';

let Contract = require('../../../smart_contracts/artifacts/contracts/AssetNFT.sol/AssetNFT.json');
const smartContractAddress = '0x36ad10998708f8020572854572319358EA250aCC'

const MyNFTs = () => {
    const [walletKey, setWalletKey] = useState('');
    const [nftData, setNFTData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getNFTData = async() => {

            const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = ethProvider.getSigner();
            const contract = new ethers.Contract(smartContractAddress, Contract.abi, signer);

            const tokenIds = await contract.getTokensOfAddress(signer.getAddress());
            const tokenURIs = await Promise.all(tokenIds.map(async (tokenId) => await contract.tokenURI(tokenId)));

            const tokens = tokenIds.map((tokenId, i) => ({ id: tokenId.toString(), uri: tokenURIs[i] }));
            
            const query = `
            query MyQuery {
                nfts(where: {id_in: ${JSON.stringify(tokenURIs)}}) {
                  name
                  description
                  image
                  id
                }
              }
                           
            `;
            console.log(query);
            const client = new GraphQLClient({url:"https://api-ap-south-1.graphcms.com/v2/cl3pq3iqv7fcn01z6bn7whqqw/master",
                headers: {
                    Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE2NTM3ODQxNDQsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmdyYXBoY21zLmNvbS92Mi9jbDNwcTNpcXY3ZmNuMDF6NmJuN3docXF3L21hc3RlciIsImh0dHBzOi8vbWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQuZ3JhcGhjbXMuY29tLyIsInN1YiI6ImVjMmMzOThjLTBlNDgtNDk3NS04MDczLWQxMjA5N2Y2NjlhMSIsImp0aSI6ImNsM3FrZG9qdDhhem8wMXhpNHBrcjJvZGMifQ.atq9IUmnaNH7xnjITPQ4hgkNBZJjY1B1pIwpvuELvFmJF54wdBNe_nLq5Z79WSDZlJCi4U4PXck2XAMoOSWPErhT7Y4oUfUMZSW1aKwcswj7u5PyF0q-yFafE9MBfVGbflZnMgpqjfUAm__SqeLICFfSgl4nwN2wBAZGMcr-bn0M9l0fDjs43aKMrmuHWZpD8bot5tcbZrBJ0e23j3cwiar2cuwF_-yCteruZ_X77YTpyf0k5V3wYpR-shwnn9zGcYaEJJqA5yzVuVKSUoJhX9CGzAngCRZdNuFqR7okNBUPmBXPMU_g1iGnrUYodEP57Phq49W-3a_ImPCsz8Aj8R6pOTsmPISrf-0JMx-dNp6ZquQoEor5whuZkE8RNWWJrg-KciSmPOl1tjqQUQAJKCusQpPEqA7ymOgVmOJKTxr5gpaiXTw7C0MYTTM2SsFFgPYquu-xcJZiyXPNumbUDNYHk2K06W4RSCDHO5XsHs3upSXsQeOYS7nlKnzQr_NH79KFSaHZJJD30QknjjbOehk-Mk-iDNfCajg28xVjxVvE3Z4mUTabE14r1VzDXK3e5fHOwoUzNvPBiR5_RRiqdsd1tVZ4CRm2AXzWSf8CtV_nZawLJTqmUk1N3z9E_sYy5VCp3SpTWVlvyQBzkOe372REGheky_N7oGBTKyihVpQ`,
                },
            });

            const res = await client.query(query);
            const data = res.data.nfts.map((nft, i) => ({...nft, tokenId: tokenIds[i].toString()}));
            
            setNFTData(data);

            setLoading(false);

        };
        getNFTData();
    }, [])

    return(
        <div>
            <div>
            <CustomNavbar />
            <div className="main">
                
                <h1>My NFTs</h1>
                {loading?
                <> 
                <CircularProgress/>
                </> : 
                <>
                {
                    nftData.map(nft => <NFTCard key={nft.id} name={nft.name} description={nft.description}  image={nft.image} id={nft.tokenId}/>)
                }
                </>}
            </div>
        </div>
        </div>
    );


};

const NFTCard = ({name, description, image, id}) => {

    return(
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                height="140"
                image={image}
                alt={name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                {name}:{id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {description}
                </Typography>
            </CardContent>
        </Card>
    );

}

export default MyNFTs;