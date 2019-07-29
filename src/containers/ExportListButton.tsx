import React, { useState, useContext } from 'react';
import { Dialog, DialogTitle } from '@material-ui/core';
import { getLang, LangContext } from '../lang';
import ExportList from './ExportList';

export interface ExportListButtonProps{
    Component: React.ComponentType;
    ComponentProps?: any;
    onClose?: () => void;
}

export default ({ Component, ComponentProps, onClose }: ExportListButtonProps) => {
    const lang = useContext(LangContext);
    const [openDialog, setOpenDialog] = useState(false);
    const onClick = (e: React.MouseEvent) => {
        setOpenDialog(true);
    };
    const onDialogClose = () => {
        setOpenDialog(false);
        onClose && onClose();
    };
    return (
        <React.Fragment>
            <Component onClick={onClick} {...ComponentProps} />
            <Dialog fullWidth maxWidth="sm" open={openDialog} onClose={onDialogClose}>
                <DialogTitle>
                    {
                        getLang('EXPORT_LIST', lang)
                    }
                </DialogTitle>
                <ExportList />
            </Dialog>
        </React.Fragment>
    );
};