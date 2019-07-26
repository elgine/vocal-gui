import React from 'react';
import Volume from '../components/Volume';
import { connect } from 'react-redux';
import { ACTION_SET_VOLUME, PlayerState } from '../store/models/player/types';

export interface PlayerVolumeProps{
    volume: number;
    onVolumeChange: (v: number) => void;
}

const mapStateToProps = (state: {player: PlayerState}) => {
    return {
        volume: state.player.volume
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onVolumeChange: dispatch.player[ACTION_SET_VOLUME]
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(({
    volume,
    onVolumeChange
}: PlayerVolumeProps) => {
    return (
        <Volume id="player-volume" value={volume} onChange={onVolumeChange} />
    );
}, (prevProps: PlayerVolumeProps, nextProps: PlayerVolumeProps) => {
    return prevProps.volume === nextProps.volume;
}));