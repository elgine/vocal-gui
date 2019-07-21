import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { TextField, InputAdornment, Tooltip, Collapse, Box, Chip } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import { ArrowRightAlt } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';
import { ENTER_KEY_CODE } from '../constant';
import { ACTION_CLIP_REGION_CHANGE } from '../store/models/timeline/types';
import TimeInput from '../components/TimeInput';

export interface ClipRegionControlsProps extends BoxProps{
    start: number;
    end: number;
    disabled: boolean;
    onClipRegionChange: (v: {start: number; end: number}) => void;
}

const toMSec = (v?: number) => {
    return ((v || 0)) * 1000;
};

const toSec = (v?: number) => {
    return (v || 0) * 0.001;
};

const mapStateToProps = (state: any) => {
    const clipRegion = state.timeline.clipRegion;
    return {
        start: clipRegion.start,
        end: clipRegion.end,
        disabled: clipRegion.start === clipRegion.end
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onClipRegionChange: dispatch.timeline[ACTION_CLIP_REGION_CHANGE]
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(({
    start, end, disabled, onClipRegionChange,
    ...others
}: ClipRegionControlsProps) => {
    const lang = useContext(LangContext);
    const [startVal, setStartVal] = useState('');
    const [endVal, setEndVal] = useState('');
    const onRegionStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/[^0-9\.]*/g, '');
        setStartVal(v);
    };
    const onRegionEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/[^0-9\.]*/g, '');
        setEndVal(v);
    };
    const onRegionStartSubmit = () => {
        if (/^\d+(\.{0,1}\d+){0,3}$/.test(startVal)) {
            let val = toMSec(Number(startVal));
            onClipRegionChange({ start: val, end });
        }
    };
    const onRegionEndSubmit = () => {
        if (/^\d+(\.{0,1}\d+){0,3}$/.test(endVal)) {
            let val = toMSec(Number(endVal));
            onClipRegionChange({ start, end: val });
        }
    };
    const onRegionStartKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === ENTER_KEY_CODE) {
            onRegionStartSubmit();
        }
    };
    const onRegionEndKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === ENTER_KEY_CODE) {
            onRegionEndSubmit();
        }
    };
    useEffect(() => setStartVal(toSec(start).toFixed(2)), [start]);
    useEffect(() => setEndVal(toSec(end).toFixed(2)), [end]);

    const textFieldStyle: React.CSSProperties = {
        maxWidth: '120px'
    };
    return (
        <Box>
            <Collapse in={!disabled} timeout={500}>
                <Box display="inline-flex" alignItems="center" {...others}>
                    <TimeInput label={`${getLang('CLIP', lang)}: `} value={[start, end]} />
                    {/* <TextField style={textFieldStyle} disabled={disabled} InputProps={{
                        endAdornment: <InputAdornment position="end">{getLang('SECOND', lang)}</InputAdornment>
                    }} placeholder={getLang('START_TIME', lang)} value={startVal} onChange={onRegionStartChange} onKeyDown={onRegionStartKeyDown} onBlur={onRegionStartSubmit}
                    />
                    <Box px={1}><ArrowRightAlt /></Box>
                    <TextField style={textFieldStyle} disabled={disabled} InputProps={{
                        endAdornment: <InputAdornment position="end">{getLang('SECOND', lang)}</InputAdornment>
                    }} placeholder={getLang('END_TIME', lang)} value={endVal} onChange={onRegionEndChange} onKeyDown={onRegionEndKeyDown} onBlur={onRegionEndSubmit}
                    /> */}
                </Box>
            </Collapse>
        </Box>
    );
}, (prevProps: ClipRegionControlsProps, nextProps: ClipRegionControlsProps) => {
    return prevProps.start === nextProps.start &&
        prevProps.end === nextProps.end &&
        prevProps.disabled === nextProps.disabled;
}));