import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import Pointer from './Pointer';
import { toTimeString } from '../../utils/time';
import { fade } from '../utils/color';
import Tooltip from '../Tooltip';
import PointerWithLabel from './PointerWithLabel';

const timelineRegionStyles = (theme: Theme): any => {
    return {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        '.pointer-start': {
            left: 0
        },
        '.pointer-end': {
            left: '100%'
        }
    };
};

export interface TimelineRegionProps extends React.HTMLAttributes<{}>{
    pixelsPerMSec?: number;
    region?: Segment;
    color?: string;
}

export default ({ pixelsPerMSec, region, color, style, ...others }: TimelineRegionProps) => {
    const ppms = pixelsPerMSec || 0.05;
    const r = region || { start: 0, end: 0 };
    const c = color || '#11ebce';
    const combinedStyle: React.CSSProperties = {
        left: `${r.start * ppms}px`,
        width: `${(r.end - r.start) * ppms}px`,
        backgroundColor: fade(c, 0.21),
        ...style
    };
    const pointerStyle: React.CSSProperties = {
        backgroundColor: c
    };
    return (
        <div css={timelineRegionStyles} style={combinedStyle} {...others}>
            <PointerWithLabel label={toTimeString(r.start)} hasHeader className="pointer-start" color={c} style={pointerStyle} />
            <PointerWithLabel label={toTimeString(r.end)} hasHeader headerPos="bottom" className="pointer-end" color={c} style={pointerStyle} />
        </div>
    );
};