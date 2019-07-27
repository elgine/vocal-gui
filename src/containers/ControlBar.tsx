import React, { useContext, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    Toolbar, IconButton, Tooltip
} from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import {
    Undo, Redo, OpenInNew, ArrowDropDown
} from '@material-ui/icons';
import Placeholder from '../components/Placeholder';
import { getLang, LangContext } from '../lang';
import LoadButton from './LoadButton';
import ClipRegionControls from './ClipRegionControls';
import ZoomControls from './ZoomControls';
import { ACTION_LOAD_SOURCE } from '../store/models/editor/types';
import ExportButton from './ExportButton';
import { ACTION_UNDO, ACTION_REDO } from '../store/models/history/types';
import { RematchDispatch } from '@rematch/core';
import { Models } from '../store';

export default React.memo(({ ...others }: ToolbarProps) => {
    const lang = useContext(LangContext);
    const dispatch = useDispatch<RematchDispatch<Models>>();
    const onLoadSource = dispatch.editor[ACTION_LOAD_SOURCE];
    const onUndo = useCallback(() => dispatch({ type: ACTION_UNDO }), []);
    const onRedo = useCallback(() => dispatch({ type: ACTION_REDO }), []);
    return (
        <Toolbar {...others}>
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
            <Placeholder textAlign="center">
                <ClipRegionControls />
            </Placeholder>
            <ZoomControls />
        </Toolbar>
    );
}, () => true);