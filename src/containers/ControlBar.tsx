import React, { useContext } from 'react';
import { connect } from 'react-redux';
import {
    Toolbar, IconButton, Tooltip,
} from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import {
    Undo, Redo, OpenInNew, ArrowDropDown
} from '@material-ui/icons';
import Placeholder from '../components/Placeholder';
import { getLang, LangContext } from '../lang';
import LoadButton from '../components/LoadButton';
import ClipRegionInput from './ClipRegionControls';
import ZoomControls from './ZoomControls';
import { ACTION_LOAD_SOURCE } from '../store/models/source/types';
import { ACTION_UNDO, ACTION_REDO } from '../store/models/history/types';

export interface ControlBarProps extends ToolbarProps{
    onLoadSource: (v: {type: SourceType; value?: string| File}) => void;
    onUndo: () => void;
    onRedo: () => void;
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onLoadSource: dispatch.source[ACTION_LOAD_SOURCE],
        onUndo: dispatch.history[ACTION_UNDO],
        onRedo: dispatch.history[ACTION_REDO]
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(({
    onRedo, onUndo, onLoadSource,
    ...others
}: ControlBarProps) => {
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
                <ClipRegionInput />
            </Placeholder>
            <ZoomControls />
        </Toolbar>
    );
}, () => true));