import React, { useState, useContext } from 'react';
import { LangContext, getLang } from '../lang';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import Export from '../components/Export';
import ExportPanel from './ExportPanel';
import { useDispatch } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { ACTION_RENDER } from '../store/models/render/types';

export default () => {
    const lang = useContext(LangContext);
    const dispatch = useDispatch<RematchDispatch>();
    const onRender = dispatch.render[ACTION_RENDER];
    const [showExport, setShowExport] = useState(false);
    const [sampleRate, setSampleRate] = useState(44100);
    const [bitRate, setBitRate] = useState(128);
    const [format, setFormat] = useState<ExportFormat>('MP3');
    const onExport = () => {
        onRender({
            sampleRate,
            bitRate,
            format
        });
        setShowExport(false);
    };
    return (
        <React.Fragment>
            <Tooltip title={getLang('EXPORT', lang)} onClick={() => setShowExport(true)}>
                <IconButton>
                    <Export />
                </IconButton>
            </Tooltip>
            <Dialog open={showExport} onClose={() => setShowExport(false)}>
                <DialogTitle>
                    {
                        getLang('EXPORT', lang)
                    }
                </DialogTitle>
                <DialogContent>
                    <ExportPanel sampleRate={sampleRate} onSampleRateChange={setSampleRate}
                        bitRate={bitRate} onBitRateChange={setBitRate}
                        format={format} onFormatChange={setFormat}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowExport(false)}>{getLang('CANCEL', lang)}</Button>
                    <Button onClick={onExport} color="primary">{getLang('EXPORT', lang)}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};