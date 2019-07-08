import React from 'react';
import { Box, Select, MenuItem, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

export interface ExportPanelProps{
    open?: boolean;
    onCancel: () => void;
    onExport: (v: any) => void;
}

export default ({ open, onCancel, onExport }: ExportPanelProps) => {
    return (
        <Dialog open={open || false} onClose={onCancel}>
            <DialogTitle>
                Export
            </DialogTitle>
            <DialogContent dividers>
                <Box>
                    <Select fullWidth>
                        <MenuItem>.wav</MenuItem>
                        <MenuItem>.mp3</MenuItem>
                    </Select>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button>
                    Cancel
                </Button>
                <Button onClick={onExport} autoFocus>
                    Export
                </Button>
            </DialogActions>
        </Dialog>
    );
};