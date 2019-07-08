import React from 'react';
import { Box } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import { fade } from '../utils/color';
import Pointer from './Pointer';

export interface SelectionProps extends BoxProps{
    start?: number;
    end?: number;
    pixelsPerMSec?: number;
    color?: string;
}

export default ({ start, end, pixelsPerMSec, color }: SelectionProps) => {
    const s = start || 0;
    const e = end || 0;
    const ppms = pixelsPerMSec || 0.05;
    const c = color || '#1be469';
    const left = s * ppms;
    const width = (e - s) * ppms;
    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${left}px`,
        width: `${width}px`,
        top: 0,
        height: '100%'
    };
    return (
        <Box bgcolor={fade(c, 0.12)} style={style}>
            <Pointer color={c} headShape="circular" left={0} />
            <Pointer color={c} headShape="circular" left={width} />
        </Box>
    );
};