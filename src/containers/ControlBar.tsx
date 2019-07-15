import React, { useContext, useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
    Toolbar, IconButton, Tooltip, Button, Divider,
    TextField, InputAdornment, Box, Menu, List,
    MenuItem, ListItemAvatar, ListItemText, Slider,
    Collapse
} from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import {
    Undo, Redo, Flip as Clip, ArrowRightAlt, OpenInNew,
    ArrowDropDown, CloudUpload, Link, Mic, ZoomIn, ZoomOut
} from '@material-ui/icons';
import Placeholder from '../components/Placeholder';
import { getLang, LangContext } from '../lang';
import ToggleButton from '../components/ToggleButton';

const mapStateToProps = (state: any) => {
    return {

    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {

    };
};

export interface ControlBarProps extends ToolbarProps{
    cliping?: boolean;
    onClipingChange?: (v: boolean) => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(({ cliping, onClipingChange, ...others }: ControlBarProps) => {
    const lang = useContext(LangContext);
    const newBtnRef = useRef<HTMLButtonElement>(null);
    const [showNewDialog, setShowNewDialog] = useState(false);
    const onClipModeChange = (v: boolean) => {
        onClipingChange && onClipingChange(v);
    };
    const onNewBtnClick = () => {
        setShowNewDialog(true);
    };
    return (
        <React.Fragment>
            <Toolbar {...others}>
                <Tooltip title={getLang('NEW', lang)}>
                    <Button ref={newBtnRef} onClick={onNewBtnClick}>
                        <OpenInNew />
                        &nbsp;
                        <ArrowDropDown />
                    </Button>
                </Tooltip>
                <Tooltip title={getLang('UNDO', lang)}>
                    <IconButton>
                        <Undo />
                    </IconButton>
                </Tooltip>
                <Tooltip title={getLang('REDO', lang)}>
                    <IconButton>
                        <Redo />
                    </IconButton>
                </Tooltip>
                <Tooltip title={getLang('CLIP', lang)}>
                    <ToggleButton value={cliping} onChange={onClipModeChange}>
                        <Clip />
                    </ToggleButton>
                </Tooltip>
                <Divider />
                <Placeholder position="relative">
                    <Collapse in={cliping}>
                        <Box px={1} display="flex" alignItems="center">
                            <TextField InputProps={{
                                endAdornment: <InputAdornment position="end">{getLang('SECOND', lang)}</InputAdornment>
                            }} placeholder={getLang('START_TIME', lang)}
                            />
                            <Box px={2}><ArrowRightAlt /></Box>
                            <TextField InputProps={{
                                endAdornment: <InputAdornment position="end">{getLang('SECOND', lang)}</InputAdornment>
                            }} placeholder={getLang('END_TIME', lang)}
                            />
                        </Box>
                    </Collapse>
                </Placeholder>
                <Tooltip title={getLang('ZOOM_IN_TIMELINE', lang)}>
                    <ToggleButton>
                        <ZoomIn />
                    </ToggleButton>
                </Tooltip>
                <Tooltip title={getLang('ZOOM_OUT_TIMELINE', lang)}>
                    <ToggleButton>
                        <ZoomOut />
                    </ToggleButton>
                </Tooltip>
                <Box ml={2}>
                    <Slider style={{ width: `${120}px` }} />
                </Box>
            </Toolbar>
            <Menu anchorEl={newBtnRef.current} open={showNewDialog} anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }} onClose={() => setShowNewDialog(false)}>
                <List>
                    <MenuItem button>
                        <ListItemAvatar>
                            <CloudUpload />
                        </ListItemAvatar>
                        <ListItemText primary={getLang('LOAD_FROM_LOCAL', lang)} />
                    </MenuItem>
                    <MenuItem button>
                        <ListItemAvatar>
                            <Link />
                        </ListItemAvatar>
                        <ListItemText primary={getLang('LOAD_FROM_URL', lang)} />
                    </MenuItem>
                    <MenuItem button>
                        <ListItemAvatar>
                            <Mic />
                        </ListItemAvatar>
                        <ListItemText primary={getLang('LOAD_FROM_MIC', lang)} />
                    </MenuItem>
                </List>
            </Menu>
        </React.Fragment>
    );
});