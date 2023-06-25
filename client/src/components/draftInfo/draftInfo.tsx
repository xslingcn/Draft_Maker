import React, { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ShareButton } from './shareButton/shareButton';
import { DraftHistory } from './draftHistory/draftHistory';
import { ItemPick } from './itemPick/itemPick';
import { handleResponse } from '../../utils/toast.utils';
import { Box, Grid, IconButton, Typography } from '@mui/material';

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

interface DraftInfoProps{
    draftId: string;
}

/**
 * Component for displaying the draft info.
 */
export const DraftInfo = ({ draftId }: DraftInfoProps) => {
    const [draftData, setDraftData] = useState<DraftData | null>(null);

    useEffect(() => {
        if(draftId)
            getDraftData();
    }, [draftId]);

    const getDraftData = async () => {
        try {
            const response = await fetch(`/api/draft/${draftId}`);
            const data = await response.json();
            handleResponse(data, () => setDraftData(data.data), true);
        } catch (error) {
            console.error('Error while getting draft data:', error);
        }
    }

    if (!draftId) return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
        >
            <Typography variant="h6" color="textSecondary">Empty workspace :)</Typography>
        </Box>
    )

    if (!draftData) return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
        >
            <Typography variant="h6" color="textSecondary">Loading...</Typography>
        </Box>
    )

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <DraftHistory {...draftData} />
            <ItemPick draft={draftData} getDraftData={getDraftData} />

            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <IconButton
                        onClick={getDraftData}
                    > <RefreshIcon />
                    </IconButton>
                </Grid>
                <Grid item>
                    <ShareButton draftId={draftData.uuid} />
                </Grid>
            </Grid>

            
        </Box>
    );
};
