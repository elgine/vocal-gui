import React, { useContext } from 'react';
import { connect } from 'react-redux';
import {
    PlayerState,
    ACTION_SWITCH_REPEAT,
    ACTION_SWITCH_PLAYING
} from '../store/models/player/types';
import {
    ACTION_SKIP_PREVIOUS,
    ACTION_SKIP_NEXT,
    ACTION_SEEK,
    TimelineState
} from '../store/models/timeline/types';
import { Tooltip, IconButton } from '@material-ui/core';
import { SkipPrevious, SkipNext } from '@material-ui/icons';
import PlayButton from '../components/PlayButton';
import RepeatButton from '../components/RepeatButton';
import { LangContext, getLang } from '../lang';

const mapStateToProps = (state: {player: PlayerState}) => {
    return {
        playing: state.player.playing,
        repeat: state.player.repeat
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onSkipPrevious: dispatch.timeline[ACTION_SKIP_PREVIOUS],
        onSkipNext: dispatch.timeline[ACTION_SKIP_NEXT],
        onRepeatChange: dispatch.player[ACTION_SWITCH_REPEAT],
        onPlayingChange: dispatch.player[ACTION_SWITCH_PLAYING],
    };
};

export interface PlayerControlsProps{
    playing: boolean;
    repeat: boolean;
    onSkipPrevious: () => void;
    onSkipNext: () => void;
    onRepeatChange: (v: boolean) => void;
    onPlayingChange: (v: boolean) => void;
}


export default connect(mapStateToProps, mapDispatchToProps)(React.memo(({
    playing, repeat,
    onSkipPrevious, onSkipNext,
    onRepeatChange, onPlayingChange
}: PlayerControlsProps) => {
    const lang = useContext(LangContext);
    return (
        <React.Fragment>
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
        </React.Fragment>
    );
}, (prevProps: PlayerControlsProps, nextProps: PlayerControlsProps) => {
    return prevProps.playing === nextProps.playing &&
        prevProps.repeat === nextProps.repeat;
}));