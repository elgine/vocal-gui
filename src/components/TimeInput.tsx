import React, { useState, useRef } from 'react';
import { Chip, Box, Dialog, TextField, Popper, Paper } from '@material-ui/core';
import { ChipProps } from '@material-ui/core/Chip';
import { ArrowRightAlt } from '@material-ui/icons';
import { toTimeString } from '../utils/time';

export interface TimeInputProps<T = number|number[]> extends Omit<ChipProps, 'onChange'>{
    value?: T;
    onChange?: (v: T) => void;
}

function TimeInput<T = number | number[]>({ value, label, onChange, onClick, ...others }: TimeInputProps<T>) {
    const valList = Array.isArray(value) ? value : [value];
    const [showEditPane, setShowEditPane] = useState(false);
    const onChipClick = (e: React.MouseEvent<HTMLDivElement>) => {
        setShowEditPane(!showEditPane);
        onClick && onClick(e);
    };
    const chipRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLDivElement>(null);
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
            <Popper anchorEl={chipRef.current} open={showEditPane}
                modifiers={{
                    flip: {
                        enabled: true,
                    },
                    preventOverflow: {
                        enabled: true,
                        boundariesElement: 'scrollParent',
                    },
                    arrow: {
                        enabled: true,
                        element: arrowRef
                    },
                }}>
                <div ref={arrowRef}></div>
                <Paper>
                    <Box p={2}>
                        <TextField variant="outlined" />
                        {
                            valList[1] !== undefined ? (
                                <React.Fragment>
                                    <Box px={1}><ArrowRightAlt /></Box>
                                    <TextField />
                                </React.Fragment>
                            ) : undefined
                        }
                    </Box>
                </Paper>
            </Popper>
        </React.Fragment>
    );
}

export default TimeInput;