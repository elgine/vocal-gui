import React, { useContext } from 'react';
import {
    Toolbar
} from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import Placeholder from '../components/Placeholder';
import { Tune } from '@material-ui/icons';
import { getLang, LangContext } from '../lang';
import ToggleButton from '../components/ToggleButton';
import PlayerControls from './PlayerControls';
import PlayerVolume from './PlayerVolume';
import PlayerCurrentTimeInput from './PlayerCurrentTimeInput';

export interface PlayerControlBarProps extends Omit<ToolbarProps, 'onVolumeChange'>{
    showEffectPanel?: boolean;
    onToggleEffectPanel: (v: boolean) => void;
}

export default React.memo(({
    showEffectPanel,
    onToggleEffectPanel,
    ...others
}: PlayerControlBarProps) => {
    const lang = useContext(LangContext);
    return (
        <Toolbar {...others}>
            <PlayerVolume />
            <Placeholder id="player-control-list" display="flex" alignItems="center" justifyContent="center">
                <PlayerControls />
                <PlayerCurrentTimeInput />
            </Placeholder>
            <ToggleButton id="effect-panel-collapse-button" value={showEffectPanel} onChange={onToggleEffectPanel}>
                <Tune />
                &nbsp;
                {
                    getLang('EFFECT', lang)
                }
            </ToggleButton>
        </Toolbar>
    );
}, (prevProps: PlayerControlBarProps, nextProps: PlayerControlBarProps) => {
    return prevProps.showEffectPanel === nextProps.showEffectPanel &&
        prevProps.onToggleEffectPanel === nextProps.onToggleEffectPanel;
});