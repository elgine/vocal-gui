import React, { useContext } from 'react';
import { RematchDispatch } from '@rematch/core';
import { Collapse, Box } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import { LangContext, getLang } from '../lang';
import { ACTION_CLIP_REGION_CHANGE, TimelineState } from '../store/models/timeline/types';
import TimeInput from '../components/TimeInput';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { StateWithHistory } from 'redux-undo';

const mapStateToProps = (state: StateWithHistory<{timeline: TimelineState}>) => {
    const clipRegion = state.present.timeline.clipRegion;
    return {
        value: clipRegion
    };
};

export default React.memo((props: BoxProps) => {
    const lang = useContext(LangContext);
    const { value } = useSelector(mapStateToProps, shallowEqual);
    const disabled = value[0] === value[1];
    const dispatch = useDispatch<RematchDispatch>();
    const onChange = dispatch.timeline[ACTION_CLIP_REGION_CHANGE];
    return (
        <Collapse in={!disabled} timeout={500}>
            <Box display="inline-flex" alignItems="center" {...props}>
                <TimeInput label={`${getLang('CLIP', lang)}: `} value={value} onChange={onChange}
                    placeholder={[getLang('START_TIME', lang), getLang('END_TIME', lang)]}
                />
            </Box>
        </Collapse>
    );
}, () => true);