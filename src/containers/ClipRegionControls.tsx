import React, { useContext } from 'react';
import { RematchDispatch } from '@rematch/core';
import { useSelector, useDispatch } from 'react-redux';
import { Collapse, Box } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import { LangContext, getLang } from '../lang';
import { ACTION_CLIP_REGION_CHANGE } from '../store/models/timeline/types';
import TimeInput from '../components/TimeInput';

const mapStateToProps = (state: any) => {
    const clipRegion = state.timeline.clipRegion;
    return {
        value: clipRegion,
        disabled: clipRegion[0] === clipRegion[1]
    };
};

export default React.memo((props: BoxProps) => {
    const dispatch = useDispatch<RematchDispatch>();
    const onChange = dispatch.timeline[ACTION_CLIP_REGION_CHANGE];
    const { disabled, value } = useSelector(mapStateToProps);
    const lang = useContext(LangContext);
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