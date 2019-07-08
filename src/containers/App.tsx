import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { Toolbar, Box, IconButton, Tooltip } from '@material-ui/core';
import { MoreVert, Help, Undo, Redo, Settings } from '@material-ui/icons';
import theme from './theme';
import Grow from '../components/Grow';
import { getLang, Lang } from '../lang';
import Timeline from './Timeline';

export default () => {
    return (
        <ThemeProvider theme={theme}>
            <Box bgcolor="common[type]" height="100%">
                <Box bgcolor="common[type]" height="64px" borderBottom={1} borderColor="divider">
                    <Toolbar >
                        <Tooltip title={getLang('UNDO', Lang.CN)}>
                            <IconButton>
                                <Undo />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={getLang('REDO', Lang.CN)}>
                            <IconButton>
                                <Redo />
                            </IconButton>
                        </Tooltip>
                        <Grow />
                        <Tooltip title={getLang('HELP', Lang.CN)}>
                            <IconButton>
                                <Help />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={getLang('SETTINGS', Lang.CN)}>
                            <IconButton>
                                <Settings />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </Box>
                <Timeline />
                <Box>

                </Box>
            </Box>
        </ThemeProvider>
    );
};