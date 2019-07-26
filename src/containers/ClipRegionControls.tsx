import React, { useContext } from 'react';
import { RematchDispatch } from '@rematch/core';
import { Collapse, Box } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import { LangContext, getLang } from '../lang';
import { ACTION_CLIP_REGION_CHANGE } from '../store/models/timeline/types';
import TimeInput from '../components/TimeInput';
import { connect } from 'react-redux';

const mapStateToProps = (state: any) => {
    const clipRegion = state.timeline.clipRegion;
    return {
        value: clipRegion
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onChange: dispatch.timeline[ACTION_CLIP_REGION_CHANGE]
    };
};

export interface ClipRegionControlsProps{
    value: number[];
    onChange: (v: number[]) => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(({ value, onChange }: ClipRegionControlsProps) => {
    const disabled = value[0] === value[1];
    const lang = useContext(LangContext);
    return (
        <Collapse in={!disabled} timeout={500}>
            <Box display="inline-flex" alignItems="center">
                <TimeInput label={`${getLang('CLIP', lang)}: `} value={value} onChange={onChange}
                    placeholder={[getLang('START_TIME', lang), getLang('END_TIME', lang)]}
                />
            </Box>
        </Collapse>
    );
}, (prevProps: ClipRegionControlsProps, nextProps: ClipRegionControlsProps) => {
    return prevProps.value === nextProps.value;
}));