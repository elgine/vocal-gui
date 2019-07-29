import React, { useState, useContext } from 'react';
import { LangContext, getLang } from '../lang';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import ExportSettingsPanel from './ExportSettingsPanel';
import { useDispatch } from 'react-redux';
import { ACTION_RENDER } from '../store/models/render/types';
import { RematchDispatch } from '@rematch/core';

export interface ExportButtonProps{
    Component: React.ComponentType<any>;
    ComponentProps?: any;
    onClose?: () => void;
}

export default ({ Component, ComponentProps, onClose }: ExportButtonProps) => {
    const lang = useContext(LangContext);
    const [showExport, setShowExport] = useState(false);
    const dispatch = useDispatch<RematchDispatch>();
    const onRender = dispatch.render[ACTION_RENDER];
    const [sampleRate, setSampleRate] = useState(44100);
    const [bitRate, setBitRate] = useState(128);
    const [format, setFormat] = useState<ExportFormat>('MP3');
    const onAddTask = () => {
        onRender({
            sampleRate,
            bitRate,
            format
        });
        onClose && onClose();
    };
    return (
        <React.Fragment>
            <Component onClick={() => setShowExport(true)} {...ComponentProps} />
            <Dialog fullWidth maxWidth="xs" open={showExport} onClose={() => setShowExport(false)}>
                <DialogTitle>
                    {
                        getLang('EXPORT', lang)
                    }
                </DialogTitle>
                <DialogContent>
                    <ExportSettingsPanel sampleRate={sampleRate} onSampleRateChange={setSampleRate}
                        bitRate={bitRate} onBitRateChange={setBitRate}
                        format={format} onFormatChange={setFormat}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowExport(false)}>
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
        </React.Fragment>
    );
};