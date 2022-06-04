import { ethers } from "ethers";
import { useState } from 'react';
import { TextField, CircularProgress } from '@mui/material';
import CustomNavbar from '../../components/navbar';
import { Button } from '@mui/material'
import FileBase64 from 'react-file-base64';
import GraphQLClient from 'graphql-client';
import swal from 'sweetalert';

let Contract = require('../../../smart_contracts/artifacts/contracts/AssetNFT.sol/AssetNFT.json');

const smartContractAddress = '0x36ad10998708f8020572854572319358EA250aCC';


const createNFT = () => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [walletKey, setWalletKey] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const mutation = `
        mutation () {
            createNft(
            data: {
                name: "${name}"
                image: "${file}"
                description: "${description}"
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
        setLoading(true);
        const res = await client.query(mutation);
        console.log(res);
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = ethProvider.getSigner();
        const contract = new ethers.Contract(smartContractAddress, Contract.abi, signer);
        const metadataURI = res.data.createNft.id;
        const address = await signer.getAddress();

        console.log(`Adding token to ${address}`);
        try {
            const tx = await contract.mintNFT(address, metadataURI);
            
            const res = await tx.wait();
            console.log("Minted NFT");
            console.log(`Token ID: ${res.logs[0].topics[3]}`);
            swal(`NFT Minted!`, `Token ID: ${res.logs[0].topics[3]}`, 'success');
        }
        catch (e) {
            console.log(e);
            swal(`Oops`, `Failed to mint NFT.`, 'error');
        } finally {
            setLoading(false);
        }
        
    }

    return (
        <div>
            <CustomNavbar />
            <div className="main">
                
                {loading?
                <> 
                <h1>Creating NFT</h1>
                <CircularProgress/>
                </> : 
                <>
                <h1>Create NFT</h1>
                <div style={{ margin: "20px" }}>
                    <FileBase64 onDone={e => setFile(e.base64)}/>
                </div>
                <div className="input-field">
                    <TextField id="filled-basic" label="Name" variant="filled" onChange={e => setName(e.target.value)} fullWidth />
                </div>
                <div className="input-field">
                    <TextField id="filled-basic" label="Description" variant="filled" onChange={e => setDescription(e.target.value)} multiline fullWidth />
                </div>
                    <Button variant="contained" style={{ backgroundColor: "orange", fontSize: "15px", margin: '10px' }} onClick={handleSubmit} >Create</Button>
                </>}
            </div>
        </div>
    )
}

export default createNFT;