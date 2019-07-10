import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { CircularProgress, Fade, Toolbar, Box, IconButton, Button, Tooltip, Typography, Menu, MenuItem } from '@material-ui/core';
import { Help, Undo, Redo, Settings } from '@material-ui/icons';
import theme from './theme';
import Grow from '../components/Grow';
import { getLang, Lang } from '../lang';
import { ACTION_LOAD_FILE_FROM_LOCAL } from '../store/source/types';
import Waveform from '../components/Waveform';
import Timeline from './Timeline';

const mapStateToProps = (state: any) => {
    return {
        ...state.source
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onImportFileFromLocal: dispatch.source[ACTION_LOAD_FILE_FROM_LOCAL]
    };
};

export interface AppProps{
    title: string;
    loading: boolean;
    audioBuffer?: AudioBuffer;
    onImportFileFromLocal: (v: File) => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(({
    title,
    loading,
    audioBuffer,
    onImportFileFromLocal
}: AppProps) => {
    const settingsBtnRef = useRef<any>(null);
    const [showSettings, setShowSettings] = useState(false);
    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.files && onImportFileFromLocal(e.target.files[0]);
    };
    return (
        <ThemeProvider theme={theme}>
            <Box bgcolor="common[type]" height="100%">
                <Box bgcolor="common[type]" height="64px" borderBottom={1} borderColor="divider">
                    <Toolbar >
                        <Tooltip title={getLang('UNDO', Lang.CN)}>
                            <IconButton>
                                <Undo fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={getLang('REDO', Lang.CN)}>
                            <IconButton>
                                <Redo fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Grow textAlign="center">
                            <Typography variant="subtitle1">
                                {
                                    title
                                }
                            </Typography>
                        </Grow>
                        <Tooltip title={getLang('HELP', Lang.CN)}>
                            <IconButton>
                                <Help fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <div>
                            <Tooltip title={getLang('SETTINGS', Lang.CN)}>
                                <IconButton ref={settingsBtnRef} onClick={() => setShowSettings(true)}>
                                    <Settings fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Menu onClose={() => setShowSettings(false)} open={showSettings} anchorEl={settingsBtnRef.current}>
                                <MenuItem>Keyboard</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </Box>
                <Box>
                    <label>
                        <input
                            hidden
                            type="file"
                            onChange={onFileInputChange}
                        />
                        <Button component="span">
                            Load local file
                        </Button>
                    </label>
                    <Fade in={loading}>
                        <CircularProgress />
                    </Fade>
                    <Timeline audioBuffer={audioBuffer} />
                </Box>
            </Box>
        </ThemeProvider>
    );
});