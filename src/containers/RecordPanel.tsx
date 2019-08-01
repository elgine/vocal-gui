import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { Box, Typography, Dialog, DialogActions, CircularProgress, Button } from '@material-ui/core';
import { DialogProps } from '@material-ui/core/Dialog';
import { withTheme, Theme } from '@material-ui/core/styles';
import {  Close, Done } from '@material-ui/icons';
import RecorderWaveform from '../components/RecorderWaveform';
import { getLang, LangContext } from '../lang';
import { toTimeString } from '../utils/time';
import Placeholder from '../components/Placeholder';
import PlayButton from '../components/PlayButton';
import Recorder from '../services/recorder';

enum RecorderState{
    UNINITED,
    FREE,
    RECORDING,
    SAVING,
    COMPLETE
}

export interface RecordPanelProps extends DialogProps{
    onConfirm?: (v: AudioBuffer) => void;
}

export default React.memo(withTheme(({
    theme, open, onClose, onConfirm,
    ...others
}: RecordPanelProps & {theme: Theme}) => {
    const recorder = Recorder.instance();
    const [state, setState] = useState(RecorderState.UNINITED);
    const lang = useContext(LangContext);
    const [hasBegan, setHasBegan] = useState(false);
    const durationRef = useRef<number>(0);
    const durationDOMRef = useRef<HTMLElement>(null);

    const updateDurationDOM = useCallback(() => {
        if (durationDOMRef.current) {
            durationDOMRef.current.innerText = toTimeString(durationRef.current);
        }
    }, []);

    const onAudioDataProcess = useCallback((b: AudioBuffer) => {
        durationRef.current += b.duration * 1000;
        updateDurationDOM();
    }, []);

    const onInit = useCallback(async () => {
        await recorder.init();
        durationRef.current = 0;
        updateDurationDOM();
        setState(RecorderState.FREE);
    }, []);

    const onStart = useCallback(() => {
        recorder.start();
        setState(RecorderState.RECORDING);
    }, []);

    const onStop = useCallback(() => {
        recorder.stop();
        setState(RecorderState.FREE);
    }, []);

    const onTriggerDiscard = useCallback(() => {
        onStop();
        recorder.clear();
        onClose && onClose({}, 'backdropClick');
    }, [onClose, onStop]);

    const onTriggerSave = useCallback(async () => {
        onStop();
        setState(RecorderState.SAVING);
        await recorder.save();
        setState(RecorderState.COMPLETE);
        recorder.buffer && onConfirm && onConfirm(recorder.buffer);
    }, [onConfirm, onStop]);

    const onPlayChange = useCallback((v: boolean) => {
        if (!v) {
            onStop();
        } else {
            onStart();
            if (!hasBegan) { setHasBegan(true) }
        }
    }, [onStop, onStart, hasBegan]);

    useEffect(() => {
        if (open && state === RecorderState.UNINITED) {
            onInit();
        }
    }, [open, state]);

    useEffect(() => {
        recorder.onProcess.on(onAudioDataProcess);
        return () => {
            recorder.onProcess.off(onAudioDataProcess);
        };
    }, [onAudioDataProcess]);
    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onTriggerDiscard} {...others}>
            <Box position="relative">
                <RecorderWaveform color={theme.palette.primary[theme.palette.type]}
                    style={{ height: '240px' }}
                />
                <Typography ref={durationDOMRef} align="center">
                    {toTimeString(durationRef.current)}
                </Typography>
            </Box>
            <DialogActions>
                <PlayButton value={state === RecorderState.RECORDING} onChange={onPlayChange} />
                <Placeholder />
                <Button disabled={state === RecorderState.SAVING}
                    onClick={onTriggerDiscard}>
                    <Close />
                    {
                        getLang('DISCARD_RECORD', lang)
                    }
                </Button>
                <Button color="primary" disabled={
                    !hasBegan ||
                    state === RecorderState.SAVING
                } onClick={onTriggerSave}>
                    {
                        state === RecorderState.SAVING ? (
                            <React.Fragment>
                                <CircularProgress size={20} />
                                &nbsp;
                                {
                                    getLang('SAVING_RECORD', lang)
                                }
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Done />
                                &nbsp;
                                {
                                    getLang('SAVE_RECORD', lang)
                                }
                            </React.Fragment>
                        )
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}), (prevProps: RecordPanelProps, nextProps: RecordPanelProps) => {
    return prevProps.open === nextProps.open &&
        prevProps.onClose === nextProps.onClose;
});