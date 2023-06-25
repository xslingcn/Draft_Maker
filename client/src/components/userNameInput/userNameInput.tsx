import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Typography, Fade } from "@mui/material";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * Component for entering a username.
 */
export const UserNameInput = () => {
    const [open, setOpen] = useState(false);

    const [userName, setLocalUserName] = useState('');
    const [_, setCookie] = useCookies(['userName']);
    const navigate = useNavigate();

    const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalUserName(event.target.value);
    }

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (userName) {
            toast.success(`Welcome, ${userName}!`);
            setCookie('userName', userName, { path: '/' });
            navigate("/drafts");
        }
        else {
            toast.warn('Please enter a username');
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
            <Fade in={true} timeout={1000}>
                <Typography variant="h3" component="h2" gutterBottom style={{ fontFamily: 'Nunito Sans, Arial, sans-serif', marginBottom: '8vh' }}>
                    Welcome to Draft Maker👋
                </Typography>
            </Fade>
            <Fade in={true} timeout={1000} style={{ transitionDelay: '500ms' }}>
                <Button variant="contained" size="large" onClick={handleClickOpen}>
                    Start
                </Button>
            </Fade>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To create or join a draft, please enter your username here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={onUserNameChange}
                        value={userName}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onSubmit}>Continue</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
