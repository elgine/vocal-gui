import React, { useContext, useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
    Popover, Toolbar, IconButton, Button, Tooltip
} from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import Volume from '../components/Volume';
import PlayButton from '../components/PlayButton';
import RepeatButton from '../components/RepeatButton';
import Grow from '../components/Placeholder';
import { Tune, SkipNext, SkipPrevious } from '@material-ui/icons';
import { getLang, LangContext } from '../lang';
import { PlayerState, ACTION_SWITCH_REPEAT, ACTION_SWITCH_PLAYING } from '../store/models/player/types';
import EffectPanel from './EffectPanel';

const mapStateToProps = ({ player }: {player: PlayerState}) => {
    return {
        ...player
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onRepeatChange: dispatch.player[ACTION_SWITCH_REPEAT],
        onPlayingChange: dispatch.player[ACTION_SWITCH_PLAYING]
    };
};

export interface PlayerControlsProps extends ToolbarProps, PlayerState{
    onRepeatChange: (v: boolean) => void;
    onPlayingChange: (v: boolean) => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(({ onRepeatChange, onPlayingChange, repeat, playing, volume, playbackSpeed, currentTime, ...others }: PlayerControlsProps) => {
    const lang = useContext(LangContext);
    const [showEffects, setShowEffects] = useState(false);
    const effectBtnRef = useRef<HTMLButtonElement>(null);
    return (
        <React.Fragment>
            <Popover open={showEffects} anchorEl={effectBtnRef.current}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                onClose={() => setShowEffects(false)}>
                <EffectPanel style={{ width: '400px', height: '500px', overflowY: 'auto' }} />
            </Popover>
            <Toolbar {...others}>
                <Volume value={volume} />
                <Grow display="flex" alignContent="center" justifyContent="center">
                    <Tooltip title={getLang('SKIP_PREVIOUS', lang)}>
                        <IconButton>
                            <SkipPrevious />
                        </IconButton>
                    </Tooltip>
                    <PlayButton value={playing} onChange={onPlayingChange} />
                    <Tooltip title={getLang('SKIP_NEXT', lang)}>
                        <IconButton>
                            <SkipNext />
                        </IconButton>
                    </Tooltip>
                    <RepeatButton value={repeat} onChange={onRepeatChange} />
                </Grow>
                <Button ref={effectBtnRef} color="primary" onClick={() => setShowEffects(true)}>
                    <Tune /> &nbsp;{getLang('APPLY_EFFECT', lang)}
                </Button>
            </Toolbar>
        </React.Fragment>
    );
});