import React, { useContext } from 'react';
import { connect } from 'react-redux';
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
import { ACTION_LOAD_SOURCE } from '../store/models/source/types';
import ExportButton from './ExportButton';
import { ACTION_UNDO, ACTION_REDO } from '../store/models/history/types';

const mapDispatchToProps = (dispatch: any) => {
    return {
        onLoadSource: dispatch.source[ACTION_LOAD_SOURCE],
        onUndo: () => dispatch({ type: ACTION_UNDO }),
        onRedo: () => dispatch({ type: ACTION_REDO })
    };
};

export interface ControlBarProps extends ToolbarProps{
    onLoadSource: () => void;
    onUndo: () => void;
    onRedo: () => void;
}

export default connect(undefined, mapDispatchToProps)(React.memo(({ onUndo, onRedo, onLoadSource, ...others }: ControlBarProps) => {
    const lang = useContext(LangContext);
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
}, () => true));