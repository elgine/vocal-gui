import React, { useState, useContext } from 'react';
import { LangContext, getLang } from '../lang';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import ExportSettingsPanel from './ExportSettingsPanel';
import { useDispatch } from 'react-redux';
import { ACTION_RENDER } from '../store/models/render/types';
import { RematchDispatch } from '@rematch/core';
import { FormValidation } from '../components/FormValidation';

export interface NewExportTaskButtonProps{
    Component: React.ComponentType<any>;
    ComponentProps?: any;
    onClose?: () => void;
}

interface ExportSettingsDialogProps{
    open?: boolean;
    onClose?: () => void;
    isValid?: boolean;
}

const ExportSettingsDialog = ({ open, onClose, isValid }: ExportSettingsDialogProps) => {
    const lang = useContext(LangContext);
    const dispatch = useDispatch<RematchDispatch>();
    const onRender = dispatch.render[ACTION_RENDER];
    const [title, setTitle] = useState('');
    const [bitRate, setBitRate] = useState(128);
    const [format, setFormat] = useState<ExportFormat>('MP3');
    const onAddTask = () => {
        if (isValid) {
            onRender({
                title,
                bitRate,
                format
            });
            onClose && onClose();
        }
    };
    return (
        <Dialog fullWidth maxWidth="xs" open={open || false} onClose={onClose}>
            <DialogTitle>
                {
                    getLang('NEW_EXPORT_TASK', lang)
                }
            </DialogTitle>
            <DialogContent>
                <ExportSettingsPanel
                    title={title} onTitleChange={setTitle}
                    bitRate={bitRate} onBitRateChange={setBitRate}
                    format={format} onFormatChange={setFormat}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {
                        getLang('CANCEL', lang)
                    }
                </Button>
                <Button color="primary" onClick={onAddTask}>
                    {
                        getLang('EXPORT', lang)
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ValidatedExportSettingsDialog = FormValidation(ExportSettingsDialog);

export default React.forwardRef(({ Component, ComponentProps, onClose }: NewExportTaskButtonProps, ref: React.Ref<any>) => {
    const [showExportDialog, setShowExportDialog] = useState(false);
    const onDialogClose = () => {
        setShowExportDialog(false);
        onClose && onClose();
    };
    return (
        <React.Fragment>
            <Component onClick={() => setShowExportDialog(true)} {...ComponentProps} />
            <ValidatedExportSettingsDialog open={showExportDialog} onClose={onDialogClose} />
        </React.Fragment>
    );
});