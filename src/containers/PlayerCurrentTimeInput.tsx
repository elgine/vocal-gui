import React, { useContext } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import TimeInput from '../components/TimeInput';
import { getLang, LangContext } from '../lang';
import { ACTION_SEEK } from '../store/models/timeline/types';
import { RematchDispatch } from '@rematch/core';
import { RootState } from '../store';

const mapStateToProps = ({ present }: RootState) => {
    return {
        disabled: present.timeline.clipRegion[0] === present.timeline.clipRegion[1],
        currentTime: present.timeline.currentTime
    };
};

export default React.memo(() => {
    const lang = useContext(LangContext);
    const { currentTime, disabled } = useSelector(mapStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch>();
    const onSeek = dispatch.timeline[ACTION_SEEK];
    return (
        <TimeInput disabled={disabled} label={`${getLang('CURRENT_TIME', lang)}: `}
            placeholder={getLang('CURRENT_TIME', lang)}
            value={currentTime} onChange={onSeek}
        />
    );
}, () => true);