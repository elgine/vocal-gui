import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import {
    Toolbar, IconButton, Tooltip
} from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import {
    Undo, Redo, OpenInNew, ArrowDropDown, Settings, HelpOutline
} from '@material-ui/icons';
import Placeholder from '../components/Placeholder';
import { getLang, LangContext } from '../lang';
import LoadButton from './LoadButton';
import ClipRegionInput from './ClipRegionControls';
import ZoomControls from './ZoomControls';
import { ACTION_LOAD_SOURCE } from '../store/models/source/types';
import ExportButton from './ExportButton';
import { RematchDispatch } from '@rematch/core';
import { ACTION_UNDO, ACTION_REDO } from '../store/models/history/types';


export default React.memo((props: ToolbarProps) => {
    const lang = useContext(LangContext);
    const dispatch = useDispatch<RematchDispatch>();
    const onLoadSource = dispatch.source[ACTION_LOAD_SOURCE];
    const onUndo = () => dispatch({ type: ACTION_UNDO });
    const onRedo = () => dispatch({ type: ACTION_REDO });
    return (
        <Toolbar {...props}>
            <Tooltip title={getLang('LOAD_SOURCE_FROM', lang)}>
                <div>
                    <LoadButton onLoadSource={onLoadSource}>
                        <OpenInNew />
                        <ArrowDropDown />
                    </LoadButton>
                </div>
            </Tooltip>
            <ExportButton />
            <Tooltip title={getLang('UNDO', lang)}>
                <IconButton onClick={onUndo}>
                    <Undo />
                </IconButton>
            </Tooltip>
            <Tooltip title={getLang('REDO', lang)}>
                <IconButton onClick={onRedo}>
                    <Redo />
                </IconButton>
            </Tooltip>
            <ZoomControls />
            <Placeholder textAlign="center">
                <ClipRegionInput />
            </Placeholder>
            <Tooltip title={getLang('SETTINGS', lang)}>
                <IconButton>
                    <Settings />
                </IconButton>
            </Tooltip>
            <Tooltip title={getLang('HELP', lang)}>
                <IconButton>
                    <HelpOutline />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
}, () => true);