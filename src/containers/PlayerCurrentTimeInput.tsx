import React, { useContext } from 'react';
import { connect } from 'react-redux';
import TimeInput from '../components/TimeInput';
import { getLang, LangContext } from '../lang';
import { TimelineState, ACTION_SEEK } from '../store/models/timeline/types';

export interface PlayerCurrentTimeInputProps{
    currentTime: number;
    onSeek: (v: number) => void;
}

const mapStateToProps = (state: {timeline: TimelineState}) => {
    return {
        currentTime: state.timeline.currentTime
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onSeek: dispatch.timeline[ACTION_SEEK]
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(({
    currentTime,
    onSeek
}: PlayerCurrentTimeInputProps) => {
    const lang = useContext(LangContext);
    return (
        <TimeInput label={`${getLang('CURRENT_TIME', lang)}: `}
            placeholder={getLang('CURRENT_TIME', lang)}
            value={currentTime} onChange={onSeek}
        />
    );
}, (prevProps: PlayerCurrentTimeInputProps, nextProps: PlayerCurrentTimeInputProps) => {
    return prevProps.currentTime === nextProps.currentTime;
}));