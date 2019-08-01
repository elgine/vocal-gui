import React, { useContext } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
    ACTION_SKIP_PREVIOUS,
    ACTION_SKIP_NEXT,
    ACTION_SWITCH_REPEAT,
    ACTION_SWITCH_PLAYING
} from '../store/models/editor/types';
import { Tooltip, IconButton, CircularProgress, Chip } from '@material-ui/core';
import { SkipPrevious, SkipNext } from '@material-ui/icons';
import PlayButton from '../components/PlayButton';
import RepeatButton from '../components/RepeatButton';
import { LangContext, getLang } from '../lang';
import { RematchDispatch } from '@rematch/core';
import { RootState, Models } from '../store';

const mapStateToProps = ({ present }: RootState) => {
    return {
        disabled: present.editor.audioBuffer === undefined,
        playing: present.editor.playing,
        repeat: present.editor.repeat,
        buffering: present.editor.buffering
    };
};

export default React.memo(() => {
    const lang = useContext(LangContext);
    const { playing, buffering, repeat, disabled } = useSelector(mapStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch<Models>>();
    const onSkipPrevious = dispatch.editor[ACTION_SKIP_PREVIOUS];
    const onSkipNext = dispatch.editor[ACTION_SKIP_NEXT];
    const onRepeatChange = dispatch.editor[ACTION_SWITCH_REPEAT];
    const onPlayingChange = dispatch.editor[ACTION_SWITCH_PLAYING];
    return (
        <React.Fragment>
            <Tooltip title={getLang('SKIP_PREVIOUS', lang)}>
                <div>
                    <IconButton disabled={disabled} onClick={onSkipPrevious}>
                        <SkipPrevious />
                    </IconButton>
                </div>
            </Tooltip>
            <PlayButton loading={buffering} disabled={disabled}
                value={playing} onChange={onPlayingChange}
            />
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