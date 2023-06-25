import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Card } from '@mui/material';
import React from 'react';

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

/**
 * Component for displaying the draft history.
 */
export const DraftHistory = (draft: DraftData) => {
    return (
        <Card style={{ margin: 'auto' }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Num</TableCell>
                            <TableCell align="center">Pick</TableCell>
                            <TableCell align="right">Drafter</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {draft.picks.map((pick, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell align="center">{pick.item}</TableCell>
                                <TableCell align="right">{pick.user}</TableCell>
                            </TableRow>
                        ))}
                        {draft.picks.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">No picks yet</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};
