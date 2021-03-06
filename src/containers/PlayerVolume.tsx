import React from 'react';
import Volume from '../components/Volume';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { ACTION_SET_VOLUME } from '../store/models/editor/types';
import { RematchDispatch } from '@rematch/core';
import { RootState, Models } from '../store';

export interface PlayerVolumeProps{
    volume: number;
    onVolumeChange: (v: number) => void;
}

const mapStateToProps = ({ present }: RootState) => {
    return {
        volume: present.editor.volume
    };
};

export default React.memo(() => {
    const { volume } = useSelector(mapStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch<Models>>();
    const onVolumeChange = dispatch.editor[ACTION_SET_VOLUME];
    return (
        <Volume id="player-volume" value={volume} onChange={onVolumeChange} />
    );
}, () => true);