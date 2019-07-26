import React, { useContext } from 'react';
import { connect, useSelector, shallowEqual, useDispatch } from 'react-redux';
import TimeInput from '../components/TimeInput';
import { getLang, LangContext } from '../lang';
import { TimelineState, ACTION_SEEK } from '../store/models/timeline/types';
import { RematchDispatch } from '@rematch/core';

export interface PlayerCurrentTimeInputProps{
    currentTime: number;
    onSeek: (v: number) => void;
}

const mapStateToProps = (state: {timeline: TimelineState}) => {
    return {
        currentTime: state.timeline.currentTime
    };
};

export default React.memo(() => {
    const lang = useContext(LangContext);
    const { currentTime } = useSelector(mapStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch>();
    const onSeek = dispatch.timeline[ACTION_SEEK];
    return (
        <TimeInput label={`${getLang('CURRENT_TIME', lang)}: `}
            placeholder={getLang('CURRENT_TIME', lang)}
            value={currentTime} onChange={onSeek}
        />
    );
}, () => true);