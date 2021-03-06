import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Chip, Box, Grow, TextField, Popper, Paper, InputAdornment } from '@material-ui/core';
import { ChipProps } from '@material-ui/core/Chip';
import { ArrowRightAlt } from '@material-ui/icons';
import { toTimeString } from '../utils/time';
import { getLang } from '../lang';
import keycode from 'keycode';
import { RootState } from '../store';

const mapLocaleStateToProps = ({ present }: RootState) => {
    return {
        ...present.locale
    };
};

export interface TimeInputProps<T = number|number[], V = string | string[]> extends Omit<ChipProps, 'onChange' | 'placeholder'>{
    disabled?: boolean;
    value?: T;
    placeholder?: V;
    onChange?: (v: T) => void;
}

const textFieldStyle: React.CSSProperties = {
    maxWidth: '160px'
};

const toMSec = (v?: number) => {
    return ((v || 0)) * 1000;
};

const toSec = (v?: number) => {
    return (v || 0) * 0.001;
};

function TimeInput<T = number | number[], V = string | string[]>({ disabled, value, placeholder, label, onChange, onClick, ...others }: TimeInputProps<T, V>) {
    const valList = useMemo(() => (Array.isArray(value) ? value : [value]), [value]);
    const { lang } = useSelector(mapLocaleStateToProps, shallowEqual);
    const placeholderList =  Array.isArray(placeholder) ? placeholder : [placeholder];
    const [showEditPane, setShowEditPane] = useState(false);
    const onChipClick = disabled ? undefined : (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        setShowEditPane(!showEditPane);
        onClick && onClick(e);
    };
    const chipRef = useRef<HTMLDivElement>(null);

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
            if (onChange) {
                if (valList[1] !== undefined) {
                    onChange([val, valList[1]] as any);
                } else {
                    onChange(val as any);
                }
            }
        }
    };
    const onRegionEndSubmit = () => {
        if (/^\d+(\.{0,1}\d+){0,3}$/.test(endVal)) {
            let val = toMSec(Number(endVal));
            onChange && onChange([valList[0], val] as any);
        }
    };
    const onRegionStartKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === keycode('enter')) {
            onRegionStartSubmit();
        }
    };
    const onRegionEndKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === keycode('enter')) {
            onRegionEndSubmit();
        }
    };
    useEffect(() => {
        setStartVal(toSec(valList[0]).toFixed(2));
        if (valList[1] !== undefined) {
            setEndVal(toSec(valList[1]).toFixed(2));
        }
    }, [valList]);
    return (
        <React.Fragment>
            <Chip ref={chipRef} label={
                <React.Fragment>
                    {label}
                    {
                        toTimeString(valList[0] || 0)
                    }
                    {
                        valList[1] !== undefined ? (
                            <React.Fragment>
                                <Box px={1}><ArrowRightAlt /></Box>
                                {toTimeString(valList[1] || 0)}
                            </React.Fragment>
                        ) : undefined
                    }
                </React.Fragment>
            } onClick={onChipClick} {...others}
            />
            <Popper anchorEl={chipRef.current} open={showEditPane} transition
                modifiers={{
                    flip: {
                        enabled: true
                    },
                    offset: {
                        enabled: true,
                        offset: `0, 8px`
                    }
                }}>
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                        <Paper elevation={3}>
                            <Box display="flex" alignItems="center" py={1} px={2}>
                                <TextField variant="outlined" label={placeholderList[0]}
                                    margin="dense" style={textFieldStyle} InputProps={{
                                        type: 'number',
                                        endAdornment: <InputAdornment position="end">{getLang('SECOND', lang)}</InputAdornment>
                                    }}
                                    value={startVal} onChange={onRegionStartChange} onKeyDown={onRegionStartKeyDown} onBlur={onRegionStartSubmit}
                                />
                                {
                                    valList[1] !== undefined ? (
                                        <React.Fragment>
                                            <Box px={1}><ArrowRightAlt /></Box>
                                            <TextField variant="outlined" label={placeholderList[1]}
                                                margin="dense" style={textFieldStyle} InputProps={{
                                                    type: 'number',
                                                    endAdornment: <InputAdornment position="end">{getLang('SECOND', lang)}</InputAdornment>
                                                }}
                                                value={endVal} onChange={onRegionEndChange} onKeyDown={onRegionEndKeyDown} onBlur={onRegionEndSubmit}
                                            />
                                        </React.Fragment>
                                    ) : undefined
                                }
                            </Box>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
}

export default TimeInput;