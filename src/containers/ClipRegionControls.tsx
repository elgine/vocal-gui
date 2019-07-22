import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { Collapse, Box } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import { LangContext, getLang } from '../lang';
import { ACTION_CLIP_REGION_CHANGE } from '../store/models/timeline/types';
import TimeInput from '../components/TimeInput';

export interface ClipRegionControlsProps extends Omit<BoxProps, 'onChange'>{
    value: number[];
    disabled: boolean;
    onChange: (v: number[]) => void;
}

const mapStateToProps = (state: any) => {
    const clipRegion = state.timeline.clipRegion;
    return {
        value: clipRegion,
        disabled: clipRegion[0] === clipRegion[1]
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onChange: dispatch.timeline[ACTION_CLIP_REGION_CHANGE]
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(({
    value, disabled, onChange,
    ...others
}: ClipRegionControlsProps) => {
    const lang = useContext(LangContext);
    return (
        <Collapse in={!disabled} timeout={500}>
            <Box display="inline-flex" alignItems="center" {...others}>
                <TimeInput label={`${getLang('CLIP', lang)}: `} value={value} onChange={onChange}
                    placeholder={[getLang('START_TIME', lang), getLang('END_TIME', lang)]}
                />
            </Box>
        </Collapse>
    );
}, (prevProps: ClipRegionControlsProps, nextProps: ClipRegionControlsProps) => {
    return prevProps.value === nextProps.value &&
        prevProps.disabled === nextProps.disabled;
}));