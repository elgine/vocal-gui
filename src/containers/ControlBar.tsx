import React, { useContext, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    Toolbar, IconButton, Tooltip
} from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import {
    Undo, Redo
} from '@material-ui/icons';
import Placeholder from '../components/Placeholder';
import { getLang, LangContext } from '../lang';
import ClipRegionControls from './ClipRegionControls';
import ZoomControls from './ZoomControls';
import { ACTION_UNDO, ACTION_REDO } from '../store/models/history/types';
import { RematchDispatch } from '@rematch/core';
import { Models } from '../store';
import AudioFileButton from './AudioFileButton';

export default React.memo(({ ...others }: ToolbarProps) => {
    const lang = useContext(LangContext);
    const dispatch = useDispatch<RematchDispatch<Models>>();
    const onUndo = useCallback(() => dispatch({ type: ACTION_UNDO }), []);
    const onRedo = useCallback(() => dispatch({ type: ACTION_REDO }), []);
    return (
        <Toolbar {...others}>
            <AudioFileButton />
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
            <Placeholder textAlign="center">
                <ClipRegionControls />
            </Placeholder>
            <ZoomControls />
        </Toolbar>
    );
}, () => true);