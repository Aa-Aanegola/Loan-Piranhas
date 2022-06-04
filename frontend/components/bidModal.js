import { Modal, Box, Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

const BidModal = ({ open, setOpen, previousBid }) => {

    const [bid, setBid] = useState(0)

    const handleBid = () => {
        if (bid >= previousBid) {
            console.log("bkl")
            return
        }
        console.log("made bid")
    }

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
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
                <h3>Bid</h3>
                <div className="modal-input-field">
                    <h6>Current Bid:{previousBid}</h6>
                </div>
                <div className="modal-input-field">
                    <TextField label="Bid" variant="filled" fullWidth value={bid} onChange={e => setBid(e.target.value)} />
                </div>
                <div className="modal-input-field">
                    <Button variant="contained" color="primary" onClick={handleBid}>Bid</Button>
                </div>
            </Box>
        </Modal>
    )
}

export default BidModal