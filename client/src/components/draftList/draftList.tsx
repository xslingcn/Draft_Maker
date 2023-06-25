import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import DraftsIcon from '@mui/icons-material/Drafts';
import { handleResponse } from '../../utils/toast.utils';
import { Box, IconButton, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Divider, Typography } from '@mui/material';
interface DraftData {
    draftId: string;
    name: string;
}

interface DraftListProps { 
    setDraftId: (draftId: string) => void;
    handleDrawerClose: () => void;
}

/**
 * Copmpoent for displaying list of drafts.
 */
export const DraftList = ({ setDraftId, handleDrawerClose }: DraftListProps) => {
    const [drafts, setDrafts] = useState<DraftData[]>([]);

    useEffect(() => {
        refreshList();
    }, []);

    const refreshList = async () => {
        try {
            const response = await fetch('/api/drafts/list');
            const data = await response.json();
            handleResponse(data, () => setDrafts(data.data), true);
        } catch (error) {
            console.error('Error while fetching drafts list:', error);
        }
    }

    const removeDraft = async (draftId: string) => {
        try {
            await fetch(`/api/draft/${draftId}/remove`);
            refreshList();
        } catch (error) {
            console.error('Error while removing draft:', error);
        }
    }

    if (!drafts.length) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Typography variant="h6" component="div" gutterBottom style={{ fontFamily: 'Open Sans, sans-serif;' }}>
                    Drafts
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Typography variant="h6" component="div" gutterBottom style={{ fontFamily: 'Open Sans, sans-serif;' }}>
                    Drafts
                </Typography>
            </Box>
            <Divider />
            <List>
                {drafts.map(draft => (
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => removeDraft(draft.draftId)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemButton onClick={() => {
                            setDraftId(draft.draftId);
                            handleDrawerClose();
                        }}>
                            <ListItemIcon>
                                <DraftsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={draft.name}
                            />
                            </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
