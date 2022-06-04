import { Modal, Box, TextField, FormControl, InputLabel, MenuItem, Select, Button } from "@mui/material";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';

// const walletNFTs = [{
//     name: "Hyaena hyaena",
//     description: "Other secondary scoliosis, cervicothoracic region",
//     id: "0xcd5f0fde52de91f0ba33c67576f3250a9c628609"
// }, {
//     name: "Bucorvus leadbeateri",
//     description: "Nondisp transverse fx shaft of r rad, 7thF",
//     id: "0x1ce303a2fa7ee71b9f95b7c2aac80bc9c77425c3"
// }, {
//     name: "Alectura lathami",
//     description: "Disp fx of prox phalanx of unsp less toe(s), init for opn fx",
//     id: "0x8e582ca6609104fbc85dacf0e59ea82880d860f2"
// }, {
//     name: "Epicrates cenchria maurus",
//     description: "Other fish poisoning, assault",
//     id: "0x98fca8a074478eeb4c4232fdc785fb546cc8e09e"
// }, {
//     name: "Mycteria leucocephala",
//     description: "Injury of intercostal blood vessels",
//     id: "0x5c1686bf37456e69f2e2d0b31f2f1a03fa016f77"
// }, {
//     name: "Chlamydosaurus kingii",
//     description: "Displ transverse fx r patella, subs for clos fx w nonunion",
//     id: "0x5699d417c9d64540db35c02d3db733eb28fdcfec"
// }, {
//     name: "Trichoglossus haematodus moluccanus",
//     description: "Ped w convey injured in clsn w nonmtr vehicle in traf, subs",
//     id: "0xcc97e3480e1683f92f598f6b02934f518644c989"
// }, {
//     name: "Spheniscus mendiculus",
//     description: "Unsp fracture of unsp wrist and hand, subs for fx w nonunion",
//     id: "0x4cac5d58b2786717c22f89f1bf949bf2d6db6a74"
// }, {
//     name: "Crocuta crocuta",
//     description: "Contusion of upper arm",
//     id: "0xcdf5dc49ce78bd2f0018fa57fec0879ee3ec3e27"
// }, {
//     name: "Bos taurus",
//     description: "Nondisp fx of prox phalanx of r lit fngr, 7thG",
//     id: "0x3e5af6e230acb1d0743801a6d2a4ae1c019deb6d"
// }];

const AddListingModal = (props) => {
    const {
        open,
        setOpen,
        handleAddition, 
        walletNFTs
    } = props;

    const handleClose = () => {
        setOpen(false);
    }

    const [amount, setAmount] = useState(0);
    const [collateral, setCollateral] = useState('');
    const [lastBidDate, setLastBidDate] = useState('');
    const [lastPayDate, setLastPayDate] = useState('');
    const [maxAcceptableBid, setMaxAcceptableBid] = useState(0);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                bgcolor: 'background.paper',
            }}>
                <h3>Add Listing</h3>
                <div className="modal-input-field">
                    <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} label="Amount" variant="filled" fullWidth onChange={e => setAmount(e.target.value)} />
                </div>
                <div className="modal-input-field">
                    <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} label="Max Acceptable Bid" variant="filled" fullWidth onChange={e => setMaxAcceptableBid(e.target.value)} />
                </div>
                <div className="modal-input-field">
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                            renderInput={(props) => <TextField {...props} />}
                            label="Last Bid Date"
                            value={lastBidDate}
                            onChange={(newValue) =>
                                setLastBidDate(newValue)
                            }
                        fullWidth
                        />
                    </LocalizationProvider>
                </div>
                <div className="modal-input-field">
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                            renderInput={(props) => <TextField {...props} />}
                            label="Last Pay Date"
                            value={lastPayDate}
                            onChange={(newValue) => {
                                setLastPayDate(newValue);
                            }}
                            fullWidth
                        />
                    </LocalizationProvider>
                </div>
                <div className="modal-input-field">
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Collateral</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={collateral}
                            label="Collateral"
                            onChange={e => setCollateral(e.target.value)}
                        >
                            {walletNFTs?.map((nft, index) => {
                                return (
                                    <MenuItem key={index} value={nft}>{nft}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <Button variant="contained" color="primary" onClick={()=>handleAddition(amount, collateral, lastBidDate.format("YYYY-MM-DD"), lastPayDate.format("YYYY-MM-DD"), maxAcceptableBid)}>Add</Button>
                </div>
            </Box>
        </Modal>
    )
}

export default AddListingModal;