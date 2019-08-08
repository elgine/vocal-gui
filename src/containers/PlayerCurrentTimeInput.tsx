import React, { useContext } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import TimeInput from '../components/TimeInput';
import { getLang } from '../lang';
import { ACTION_SEEK } from '../store/models/editor/types';
import { RematchDispatch } from '@rematch/core';
import { RootState, Models } from '../store';

const mapStateToProps = ({ present }: RootState) => {
    return {
        disabled: present.editor.clipRegion[0] === present.editor.clipRegion[1],
        currentTime: present.editor.currentTime,
        lang: present.locale.lang
    };
};

export default React.memo(() => {
    const { lang, currentTime, disabled } = useSelector(mapStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch<Models>>();
    const onSeek = dispatch.editor[ACTION_SEEK];
    return (
        <TimeInput disabled={disabled} label={`${getLang('CURRENT_TIME', lang)}: `}
            placeholder={getLang('CURRENT_TIME', lang)}
            value={currentTime} onChange={onSeek}
        />
    );
}, () => true);