import React, { useContext, useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
    Toolbar, IconButton, Tooltip, Button, Collapse,
    TextField, InputAdornment, Box, Menu, List,
    MenuItem, ListItemAvatar, ListItemText, Slider
} from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import {
    Undo, Redo, Flip as Clip, TouchApp,
    Tune, ArrowRightAlt, OpenInNew, ArrowDropDown,
    CloudUpload, Link, Mic, ZoomIn, ZoomOut
} from '@material-ui/icons';
import Grow from '../components/Grow';
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

}

export default connect(mapStateToProps, mapDispatchToProps)(({ ...others }: ControlBarProps) => {
    const lang = useContext(LangContext);
    const newBtnRef = useRef<HTMLButtonElement>(null);
    const [showCollapse, setShowCollapse] = useState(true);
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const onClipModeChange = (v: boolean) => {

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
                    <ToggleButton onChange={onClipModeChange}>
                        <Clip />
                    </ToggleButton>
                </Tooltip>
                <Tooltip title={getLang('POINTER', lang)}>
                    <ToggleButton>
                        <TouchApp />
                    </ToggleButton>
                </Tooltip>
                <Grow />
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
            <Collapse in={showCollapse}>
                <Toolbar style={{ justifyContent: 'center' }}>
                    <TextField InputProps={{
                        endAdornment: <InputAdornment position="end">{getLang('SECOND', lang)}</InputAdornment>
                    }} placeholder={getLang('START_TIME', lang)}
                    />
                    &nbsp;
                    <Box px={2}><ArrowRightAlt /></Box>
                    &nbsp;
                    <TextField InputProps={{
                        endAdornment: <InputAdornment position="end">{getLang('SECOND', lang)}</InputAdornment>
                    }} placeholder={getLang('END_TIME', lang)}
                    />
                </Toolbar>
            </Collapse>
            <Menu anchorEl={newBtnRef.current} open={showNewDialog} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
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