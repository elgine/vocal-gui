import React from 'react';
import Volume from '../components/Volume';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { ACTION_SET_VOLUME, PlayerState } from '../store/models/player/types';
import { RematchDispatch } from '@rematch/core';

export interface PlayerVolumeProps{
    volume: number;
    onVolumeChange: (v: number) => void;
}

const mapStateToProps = (state: {player: PlayerState}) => {
    return {
        volume: state.player.volume
    };
};

export default React.memo(() => {
    const { volume } = useSelector(mapStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch>();
    const onVolumeChange = dispatch.player[ACTION_SET_VOLUME];
    return (
        <Volume id="player-volume" value={volume} onChange={onVolumeChange} />
    );
}, () => true);