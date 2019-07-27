import React, { useContext } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
    PlayerState,
    ACTION_SWITCH_REPEAT,
    ACTION_SWITCH_PLAYING
} from '../store/models/player/types';
import {
    ACTION_SKIP_PREVIOUS,
    ACTION_SKIP_NEXT
} from '../store/models/timeline/types';
import { Tooltip, IconButton } from '@material-ui/core';
import { SkipPrevious, SkipNext } from '@material-ui/icons';
import PlayButton from '../components/PlayButton';
import RepeatButton from '../components/RepeatButton';
import { LangContext, getLang } from '../lang';
import { RematchDispatch } from '@rematch/core';
import { SourceState } from '../store/models/source/types';
import { StateWithHistory } from 'redux-undo';

const mapStateToProps = ({ present }: StateWithHistory<{source: SourceState; player: PlayerState}>) => {
    return {
        disabled: present.source.audioBuffer === undefined,
        playing: present.player.playing,
        repeat: present.player.repeat
    };
};


export default React.memo(() => {
    const lang = useContext(LangContext);
    const { playing, repeat, disabled } = useSelector(mapStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch>();
    const onSkipPrevious = dispatch.timeline[ACTION_SKIP_PREVIOUS];
    const onSkipNext = dispatch.timeline[ACTION_SKIP_NEXT];
    const onRepeatChange = dispatch.player[ACTION_SWITCH_REPEAT];
    const onPlayingChange = dispatch.player[ACTION_SWITCH_PLAYING];
    return (
        <React.Fragment>
            <Tooltip title={getLang('SKIP_PREVIOUS', lang)}>
                <div>
                    <IconButton disabled={disabled} onClick={onSkipPrevious}>
                        <SkipPrevious />
                    </IconButton>
                </div>
            </Tooltip>
            <PlayButton disabled={disabled} value={playing} onChange={onPlayingChange} />
            <Tooltip title={getLang('SKIP_NEXT', lang)}>
                <div>
                    <IconButton disabled={disabled} onClick={onSkipNext}>
                        <SkipNext />
                    </IconButton>
                </div>
            </Tooltip>
            <RepeatButton value={repeat} onChange={onRepeatChange} />
        </React.Fragment>
    );
}, () => true);