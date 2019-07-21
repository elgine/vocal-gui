import React, { useContext, useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
    Toolbar, IconButton, Tooltip
} from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import Volume from '../components/Volume';
import PlayButton from '../components/PlayButton';
import RepeatButton from '../components/RepeatButton';
import Grow from '../components/Placeholder';
import { SkipNext, SkipPrevious, Tune } from '@material-ui/icons';
import { getLang, LangContext } from '../lang';
import {
    PlayerState,
    ACTION_SWITCH_REPEAT,
    ACTION_SWITCH_PLAYING,
    ACTION_SET_VOLUME,
    ACTION_SKIP_PREVIOUS,
    ACTION_SKIP_NEXT,
    ACTION_SEEK
} from '../store/models/player/types';
import ToggleButton from '../components/ToggleButton';
import TimeInput from '../components/TimeInput';

const mapStateToProps = ({ player }: {player: PlayerState}) => {
    return {
        ...player
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onSkipPrevious: dispatch.player[ACTION_SKIP_PREVIOUS],
        onSkipNext: dispatch.player[ACTION_SKIP_NEXT],
        onRepeatChange: dispatch.player[ACTION_SWITCH_REPEAT],
        onPlayingChange: dispatch.player[ACTION_SWITCH_PLAYING],
        onVolumeChange: dispatch.player[ACTION_SET_VOLUME],
        onSeek: dispatch.player[ACTION_SEEK]
    };
};

export interface PlayerControlsProps extends Omit<ToolbarProps, 'onVolumeChange'>, PlayerState{
    onRepeatChange: (v: boolean) => void;
    onPlayingChange: (v: boolean) => void;
    onVolumeChange: (v: number) => void;
    onSkipPrevious: () => void;
    onSkipNext: () => void;
    showEffectPanel?: boolean;
    onToggleEffectPanel: (v: boolean) => void;
    onSeek: (v: number) => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(({
    repeat, playing, volume, playbackSpeed, currentTime, showEffectPanel,
    onRepeatChange, onPlayingChange, onVolumeChange, onSkipPrevious,
    onSkipNext, onToggleEffectPanel, onSeek,
    ...others
}: PlayerControlsProps) => {
    const lang = useContext(LangContext);
    return (
        <Toolbar {...others}>
            <Volume value={volume} onChange={onVolumeChange} />
            <Grow display="flex" alignItems="center" justifyContent="center">
                <Tooltip title={getLang('SKIP_PREVIOUS', lang)}>
                    <IconButton onClick={onSkipPrevious}>
                        <SkipPrevious />
                    </IconButton>
                </Tooltip>
                <PlayButton value={playing} onChange={onPlayingChange} />
                <Tooltip title={getLang('SKIP_NEXT', lang)}>
                    <IconButton onClick={onSkipNext}>
                        <SkipNext />
                    </IconButton>
                </Tooltip>
                <RepeatButton value={repeat} onChange={onRepeatChange} />
                <TimeInput label={`${getLang('CURRENT_TIME', lang)}: `} value={currentTime} onChange={onSeek} />
            </Grow>
            <ToggleButton value={showEffectPanel} onChange={onToggleEffectPanel}>
                <Tune />
                &nbsp;
                {
                    getLang('APPLY_EFFECT', lang)
                }
            </ToggleButton>
        </Toolbar>
    );
}, (prevProps: PlayerControlsProps, nextProps: PlayerControlsProps) => {
    return prevProps.volume === nextProps.volume &&
        prevProps.repeat === nextProps.repeat &&
        prevProps.playing === nextProps.playing &&
        prevProps.currentTime === nextProps.currentTime &&
        prevProps.showEffectPanel === nextProps.showEffectPanel &&
        prevProps.onToggleEffectPanel === nextProps.onToggleEffectPanel;
}));