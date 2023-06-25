import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { handleResponse } from '../../utils/toast.utils';
import { DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';

interface JoinDraftProps { 
    setDraftId: (draftId: string) => void;
    handleClose: () => void;
}

/**
 * Component for joining a draft.
 */
export const JoinDraft = ({ setDraftId, handleClose }: JoinDraftProps) => {
    const [shareCode, setShareCode] = useState('');
    const [cookie, _] = useCookies(['userName']);
    const userName = cookie.userName;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShareCode(event.target.value);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/drafts/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shareCode: shareCode,
                    user: userName,
                }),
            });

            const data = await response.json();
            handleResponse(data, () => {
                setDraftId(data.data.draftId)
                handleClose();
            });
            
        } catch (error) {
            console.error('Error while joining draft:', error);
        }
    }

    return (
        <>
            <DialogTitle>Join</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter share code to join a draft.
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="code"
                    label="Code"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={handleInputChange}
                    value={shareCode}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Continue</Button>
            </DialogActions>
        </>
    )
};
