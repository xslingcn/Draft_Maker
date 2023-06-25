import React, { useState } from 'react';
import { handleResponse } from '../../utils/toast.utils';
import { DialogTitle, DialogContent, Box, TextField, Button, DialogActions, Grid } from '@mui/material';

interface NewDraftProps { 
    setDraftId: (draftId: string) => void;
    handleClose: () => void;
}

/**
 * Component for creating a new draft.
 */
export const NewDraft = ({ setDraftId, handleClose }: NewDraftProps) => {
    const [name, setName] = useState('');
    const [rounds, setRounds] = useState(1);
    const [items, setItems] = useState(['']);
    const [drafters, setDrafters] = useState(['']);

    const createDraft = async () => {
        try {
            const response = await fetch('/api/drafts/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    rounds: rounds,
                    items: items.filter(item => item.length > 0),
                    users: drafters.filter(drafter => drafter.length > 0),
                }),
            });

            const data = await response.json();
            handleResponse(data, () => setDraftId(data.data.draftId));
            handleClose();
        } catch (error) {
            console.error('Error while creating new draft:', error);
        }
    }

    return (
        <>
            <DialogTitle>Create New Draft</DialogTitle>
            <DialogContent>
                <Box marginBottom={2} marginTop={1}>
                    <TextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        required
                        autoFocus
                    />
                </Box>
                <Box marginBottom={2}>
                    <TextField
                        value={rounds}
                        onChange={(e) => setRounds(parseInt(e.target.value))}
                        type="number"
                        label="Rounds"
                        variant="outlined"
                        fullWidth
                        required
                    />
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {items.map((item, index) => (
                            <Box marginBottom={2} key={index}>
                                <TextField
                                    value={item}
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index] = e.target.value;
                                        setItems(newItems);
                                    }}
                                    type="text"
                                    label="Item"
                                    variant="outlined"
                                    fullWidth
                                />
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={() => setItems([...items, ''])}>Add Item</Button>
                    </Grid>
                    <Grid item xs={6}>
                        {drafters.map((drafter, index) => (
                            <Box marginBottom={2} key={index}>
                                <TextField
                                    value={drafter}
                                    onChange={(e) => {
                                        const newDrafters = [...drafters];
                                        newDrafters[index] = e.target.value;
                                        setDrafters(newDrafters);
                                    }}
                                    type="text"
                                    label="Drafter"
                                    variant="outlined"
                                    fullWidth
                                />
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={() => setDrafters([...drafters, ''])}>Add Drafter</Button>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={createDraft} variant="contained" color="primary">Create</Button>
            </DialogActions>
        </>
    )
};