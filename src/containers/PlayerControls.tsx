import React, { useContext } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
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
    ACTION_SET_VOLUME
} from '../store/models/player/types';
import {
    ACTION_SKIP_PREVIOUS,
    ACTION_SKIP_NEXT,
    ACTION_SEEK,
    TimelineState
} from '../store/models/timeline/types';
import ToggleButton from '../components/ToggleButton';
import TimeInput from '../components/TimeInput';
import { RematchDispatch } from '@rematch/core';

const mapStateToProps = ({ player, timeline }: {player: PlayerState; timeline: TimelineState}) => {
    return {
        ...player,
        currentTime: timeline.currentTime
    };
};

export interface PlayerControlsProps extends ToolbarProps{
    showEffectPanel?: boolean;
    onToggleEffectPanel: (v: boolean) => void;
}

export default React.memo(({
    showEffectPanel,
    onToggleEffectPanel,
    ...others
}: PlayerControlsProps) => {
    const { volume, playing, repeat, currentTime } = useSelector(mapStateToProps);
    const dispatch = useDispatch<RematchDispatch>();
    const onSkipPrevious = dispatch.timeline[ACTION_SKIP_PREVIOUS];
    const onSkipNext = dispatch.timeline[ACTION_SKIP_NEXT];
    const onSeek = dispatch.timeline[ACTION_SEEK];
    const onRepeatChange = dispatch.player[ACTION_SWITCH_REPEAT];
    const onPlayingChange = dispatch.player[ACTION_SWITCH_PLAYING];
    const onVolumeChange = dispatch.player[ACTION_SET_VOLUME];
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
                <TimeInput label={`${getLang('CURRENT_TIME', lang)}: `} placeholder={getLang('CURRENT_TIME', lang)}
                    value={currentTime} onChange={onSeek}
                />
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
    return prevProps.showEffectPanel === nextProps.showEffectPanel &&
        prevProps.onToggleEffectPanel === nextProps.onToggleEffectPanel;
});