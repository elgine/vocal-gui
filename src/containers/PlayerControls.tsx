import React, { useContext, useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
    Popover, Toolbar, IconButton, Button, Tooltip, ButtonGroup,
    DialogContent, Dialog, DialogTitle, DialogActions
} from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import Volume from '../components/Volume';
import PlayButton from '../components/PlayButton';
import RepeatButton from '../components/RepeatButton';
import Grow from '../components/Placeholder';
import { Tune, SkipNext, SkipPrevious, SaveAlt } from '@material-ui/icons';
import { getLang, LangContext } from '../lang';
import { PlayerState, ACTION_SWITCH_REPEAT, ACTION_SWITCH_PLAYING, ACTION_SET_VOLUME, ACTION_SKIP_PREVIOUS, ACTION_SKIP_NEXT } from '../store/models/player/types';
import EffectPanel from './EffectPanel';
import ExportPanel from './ExportPanel';

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
        onVolumeChange: dispatch.player[ACTION_SET_VOLUME]
    };
};

export interface PlayerControlsProps extends Omit<ToolbarProps, 'onVolumeChange'>, PlayerState{
    onRepeatChange: (v: boolean) => void;
    onPlayingChange: (v: boolean) => void;
    onVolumeChange: (v: number) => void;
    onSkipPrevious: () => void;
    onSkipNext: () => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(({
    repeat, playing, volume, playbackSpeed, currentTime,
    onRepeatChange, onPlayingChange, onVolumeChange, onSkipPrevious,
    onSkipNext,
    ...others
}: PlayerControlsProps) => {
    const lang = useContext(LangContext);
    const [showEffects, setShowEffects] = useState(false);
    const effectBtnRef = useRef<HTMLButtonElement>(null);
    const [showExport, setShowExport] = useState(false);
    const exportBtnRef = useRef<HTMLButtonElement>(null);
    return (
        <React.Fragment>
            <Popover open={showEffects} anchorEl={effectBtnRef.current}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                onClose={() => setShowEffects(false)}>
                <EffectPanel style={{ width: '400px', height: '500px', overflowY: 'auto' }} />
            </Popover>
            <Dialog open={showExport} onClose={() => setShowExport(false)}>
                <DialogTitle>
                    {
                        getLang('EXPORT', lang)
                    }
                </DialogTitle>
                <DialogContent>
                    <ExportPanel />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowExport(false)}>{getLang('CANCEL', lang)}</Button>
                    <Button color="primary">{getLang('EXPORT', lang)}</Button>
                </DialogActions>
            </Dialog>
            <Toolbar {...others}>
                <Volume value={volume} onChange={onVolumeChange} />
                <Grow display="flex" alignContent="center" justifyContent="center">
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
                </Grow>
                <ButtonGroup>
                    <Button ref={effectBtnRef} color="primary" onClick={() => setShowEffects(true)}>
                        <Tune /> &nbsp;{getLang('APPLY_EFFECT', lang)}
                    </Button>
                    <Button ref={exportBtnRef} color="primary" onClick={() => setShowExport(true)}>
                        <SaveAlt /> &nbsp;
                        {
                            getLang('EXPORT', lang)
                        }
                    </Button>
                </ButtonGroup>
            </Toolbar>
        </React.Fragment>
    );
}, (prevProps: PlayerControlsProps, nextProps: PlayerControlsProps) => {
    return prevProps.volume === nextProps.volume &&
        prevProps.repeat === nextProps.repeat &&
        prevProps.playing === nextProps.playing;
}));