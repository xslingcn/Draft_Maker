import React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * Component for logging out.
 */
export const Logout = () => {
    const [_, __, removeCookie] = useCookies(['userName']);
    const navigate = useNavigate();

    const handleLogout = (_: React.MouseEvent) => { 
        removeCookie('userName');
        navigate('/');
        toast.success('Successfully logged out');
    }

    return (
        <button type="reset" onClick={handleLogout}>Logout</button>
    );
};
