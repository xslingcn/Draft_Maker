import { IconButton } from '@mui/material';
import React from 'react';
import ShareIcon from '@mui/icons-material/Share';
import { toast } from 'react-toastify';


interface ShareButtonProps { 
    draftId: string;
}

/**
 * Component for sharing a draft.
 */
export const ShareButton = ({ draftId }: ShareButtonProps) => {
    const getShareCode = async () => {
        try {
            const response = await fetch(`/api/draft/${draftId}/share`);
            const data = await response.json();
            switch (response.status) {
                case 200:
                    toast.info(`Your share code is: ${data.data.shareCode}`, {
                        position: "top-center",
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                    });
                    break;
                case 400:
                    toast.warn(data.message);
                    break;
                case 500:
                    toast.error(data.message);
                    break;
                default:
                    toast.error('Unknown error while picking item');
            }
        } catch (error) {
            console.error('Error while getting share code:', error);
        }
    }

    return (
        <IconButton
            onClick={getShareCode}
        > <ShareIcon />
        </IconButton>
    );
};
