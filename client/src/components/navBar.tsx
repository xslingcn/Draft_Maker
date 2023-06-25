import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Dialog, Drawer, Box} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ListIcon from '@mui/icons-material/List';
import { NewDraft } from "./newDraft/newDraft";
import { JoinDraft } from "./joinDraft/joinDraft";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { DraftList } from "./draftList/draftList";

interface DraftInfoProps {
    setDraftId: (draftId: string) => void;
}

/**
 * Global navigation bar component.
 */
export const NavBar = ({ setDraftId }: DraftInfoProps) => {
    const [openNewDraftDialog, setOpenNewDraftDialog] = useState(false);
    const [openJoinDraftDialog, setOpenJoinDraftDialog] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [_, __, removeCookie] = useCookies(['userName']);
    const navigate = useNavigate();

    const handleOpenNewDraftDialog = () => {
        setOpenNewDraftDialog(true);
    };

    const handleCloseNewDraftDialog = () => {
        setOpenNewDraftDialog(false);
    };

    const handleOpenJoinDraftDialog = () => {
        setOpenJoinDraftDialog(true);
    };

    const handleCloseJoinDraftDialog = () => {
        setOpenJoinDraftDialog(false);
    };

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handleLogout = (_: React.MouseEvent) => {
        removeCookie('userName');
        navigate('/');
        toast.success('Successfully logged out');
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
                        <ListIcon />
                    </IconButton>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleOpenNewDraftDialog}>
                        <AddIcon />
                    </IconButton>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleOpenJoinDraftDialog}>
                        <ArrowForwardIcon />
                    </IconButton>
                    <Box flexGrow={1} />
                    <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleLogout}>
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Dialog open={openNewDraftDialog} onClose={handleCloseNewDraftDialog}>
                <NewDraft setDraftId={setDraftId} handleClose={handleCloseNewDraftDialog} />
            </Dialog>

            <Dialog open={openJoinDraftDialog} onClose={handleCloseJoinDraftDialog}>
                <JoinDraft setDraftId={setDraftId} handleClose={handleCloseJoinDraftDialog} />
            </Dialog>

            <Drawer anchor="left"  open={drawerOpen} onClose={handleDrawerClose}>
                <DraftList setDraftId={setDraftId} handleDrawerClose={handleDrawerClose} />
            </Drawer>
        </>
    );
}