import React, { useRef, useState, useCallback, useEffect, useContext } from 'react';
import { Box, Toolbar, Typography, Fab, IconButton, CircularProgress, Tooltip, Collapse } from '@material-ui/core';
import { PlayArrow, Close, Done, Stop, SettingsOutlined } from '@material-ui/icons';
import RecorderWaveform from '../components/RecorderWaveform';
import { getLang, LangContext } from '../lang';
import { toTimeString } from '../utils/time';
import Grow from '../components/Grow';
import { getRecorder } from '../processor';

interface RecordControlsProps{
    recording?: boolean;
    saving?: boolean;
    complete?: boolean;
    onToggleBtnClick?: React.MouseEventHandler;
    onSaveClick?: React.MouseEventHandler;
    onCloseClick?: React.MouseEventHandler;
}

const RecordControls = React.memo(({ recording, complete, saving, onToggleBtnClick, onSaveClick, onCloseClick }: RecordControlsProps) => {
    const lang = useContext(LangContext);
    const saveBtnRef = useRef<any>(null);
    // Auto-focus when complete recording
    useEffect(() => {
        if (complete && saveBtnRef.current) {
            saveBtnRef.current.focus();
        }
    }, [complete]);
    return (
        <Toolbar style={{ justifyContent: 'space-between' }}>
            <Tooltip title={getLang('CLOSE_RECORD', lang)}>
                <IconButton onClick={onCloseClick}>
                    <Close />
                </IconButton>
            </Tooltip>
            <Tooltip title={recording ? getLang('STOP_RECORD', lang) : getLang('START_RECORD', lang)}>
                <Fab color="primary" onClick={onToggleBtnClick}>
                    {
                        recording ? <Stop /> : <PlayArrow />
                    }
                </Fab>
            </Tooltip>
            <Tooltip title={getLang('SAVE_RECORD', lang)}>
                <div>
                    <IconButton ref={saveBtnRef} disabled={saving || !complete} color="primary"
                        onClick={onSaveClick}>
                        {
                            saving ? <CircularProgress color="primary" size="small" /> : <Done />
                        }
                    </IconButton>
                </div>
            </Tooltip>
        </Toolbar>
    );
}, (prevProps: RecordControlsProps, nextProps: RecordControlsProps) => {
    return prevProps.recording === nextProps.recording &&
        prevProps.saving === nextProps.saving &&
        prevProps.onToggleBtnClick === nextProps.onToggleBtnClick;
});

interface RecordDurationProps{
    duration?: number;
}

const RecordDuration = React.memo(({ duration }: RecordDurationProps) => {
    return (
        <Box textAlign="center" pt={2}>
            <Typography variant="h4">
                <strong>
                    {
                        toTimeString(duration || 0)
                    }
                </strong>
            </Typography>
        </Box>
    );
}, (prevProps: RecordDurationProps, nextProps: RecordDurationProps) => {
    return prevProps.duration === nextProps.duration;
});

interface RecordPanelHeaderProps{
    recording?: boolean;
    onSettingsClick?: React.MouseEventHandler;
    onCloseClick?: React.MouseEventHandler;
}

const RecordPanelHeader = ({ recording, onSettingsClick, onCloseClick }: RecordPanelHeaderProps) => {
    const lang = useContext(LangContext);
    return (
        <Toolbar>
            <Typography variant="h6">
                Record
            </Typography>
            <Grow />
            <Tooltip title={getLang('SETTINGS', lang)}>
                <div>
                    <IconButton disabled={recording} color="inherit" onClick={onSettingsClick}>
                        <SettingsOutlined />
                    </IconButton>
                </div>
            </Tooltip>
            <Tooltip title={getLang('CLOSE_RECORD', lang)}>
                <IconButton color="inherit" onClick={onCloseClick}>
                    <Close />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
};

export interface RecordPanelProps{
    saving?: boolean;
    recording?: boolean;
    onRecordChange?: (v: boolean) => void;
    onSubmitAudioBuffer?: (v: Float32Array) => void;
    onClose?: () => void;
}

export default ({ saving, recording, onRecordChange, onClose }: RecordPanelProps) => {
    const recorder = getRecorder();
    const bufferRef = useRef<Float32Array[]>([]);
    const [duration, setDuration] = useState(0);
    const onAudioDataProcess = useCallback((b: AudioBuffer) => {
        bufferRef.current.push(b.getChannelData(0));
        setDuration(duration + b.duration * 1000);
    }, [duration]);
    const onToggleBtnClick = useCallback((e: React.MouseEvent) => {
        onRecordChange && onRecordChange(!recording);
    }, [recording, onRecordChange]);
    useEffect(() => {
        recorder.onProcess.on(onAudioDataProcess);
        return () => {
            recorder.onProcess.off(onAudioDataProcess);
        };
    }, [onAudioDataProcess]);
    return (
        <Box>
            <RecordPanelHeader />
            <Box position="relative" bgcolor="primary.main" color="primary.contrastText">
                <RecordDuration duration={duration} />
                <Box height="400px">
                    <RecorderWaveform />
                </Box>
            </Box>
            <RecordControls complete={!recording && duration > 0} recording={recording}
                saving={saving} onToggleBtnClick={onToggleBtnClick} onCloseClick={onClose}
            />
        </Box>
    );
};