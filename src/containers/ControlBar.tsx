import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
    Toolbar, IconButton, Tooltip
} from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import {
    Undo, Redo
} from '@material-ui/icons';
import Placeholder from '../components/Placeholder';
import { getLang } from '../lang';
import ClipRegionControls from './ClipRegionControls';
import ZoomControls from './ZoomControls';
import { ACTION_UNDO, ACTION_REDO } from '../store/models/history/types';
import { RematchDispatch } from '@rematch/core';
import { Models, RootState } from '../store';
import ImportButton from './ImportButton';
import ExportButton from './ExportButton';

const mapLocaleStateToProps = ({ present }: RootState) => {
    return {
        ...present.locale
    };
};

export default React.memo(({ ...others }: ToolbarProps) => {
    const { lang } = useSelector(mapLocaleStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch<Models>>();
    const onUndo = useCallback(() => dispatch({ type: ACTION_UNDO }), []);
    const onRedo = useCallback(() => dispatch({ type: ACTION_REDO }), []);
    return (
        <Toolbar {...others}>
            <ImportButton />
            <ExportButton />
            {/* <Tooltip title={getLang('UNDO', lang)}>
                <IconButton onClick={onUndo}>
                    <Undo />
                </IconButton>
            </Tooltip>
            <Tooltip title={getLang('REDO', lang)}>
                <IconButton onClick={onRedo}>
                    <Redo />
                </IconButton>
            </Tooltip> */}
            <Placeholder textAlign="center">
                <ClipRegionControls />
            </Placeholder>
            <ZoomControls />
        </Toolbar>
    );
}, () => true);