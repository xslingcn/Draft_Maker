import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { handleResponse } from '../../../utils/toast.utils';
import { Alert, Select, MenuItem, Button, SelectChangeEvent, Grid, Box } from '@mui/material';

interface Pick {
    item: string;
    user: string;
}

interface DraftData {
    uuid: string;
    name: string;
    items: string[];
    rounds: number;
    users: string[];
    picks: Pick[];
    currRound: number;
    currUserIndex: number;
    currUser: string;
    completed: boolean;
}

interface ItemPickProps { 
    draft: DraftData;
    getDraftData: () => void;
}

/**
 * Component for picking an item.
 */
export const ItemPick = ({ draft, getDraftData }: ItemPickProps) => {
    const [selectedItem, setSelectedItem] = useState(draft.items[0]);
    const [canDraft, setCanDraft] = useState(false);
    const [cookie, _] = useCookies(['userName']);
    const userName = cookie.userName;
    const [inTurn, setInTurn] = useState(draft.currUser === userName);

    useEffect(() => {
        setCanDraft(draft.users.includes(userName));
        setInTurn(draft.currUser === userName);
    }, [draft.users, userName, draft.currUser]);

    const handleSelectChange = (event: SelectChangeEvent) => {
        setSelectedItem(event.target.value);
    }

    const handlePick = async (selectedItem: string) => {
        try {
            const response = await fetch(`/api/draft/${draft.uuid}/pick`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: userName,
                    item: selectedItem,
                }),
            });
            const data = await response.json();
            handleResponse(data, () => getDraftData());
        } catch (error) {
            console.error('Error while picking item:', error);
        }
    }

    if (draft.completed) {
        return <Alert severity="success">Draft completed!</Alert>;
    }

    if (!canDraft) {
        return <Alert severity="info">You're not participating, currently waiting for {draft.currUser} to pick.</Alert>;
    }

    if (!inTurn) {
        return <Alert severity="warning">Waiting for {draft.currUser} to pick!</Alert>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>
                    <Select
                        value={selectedItem}
                        onChange={handleSelectChange}
                    >
                        {draft.items.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={() => handlePick(selectedItem)}>
                        Pick
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
