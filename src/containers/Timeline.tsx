import React, { useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import TimeScale from '../components/Timeline/TimeScale';
import Pointer from '../components/Timeline/Pointer';
import Waveform from '../components/Timeline/Waveform';
import WaveformPanel from './WaveformPanel';

const timelineStyles = (theme: Theme): any => {
    return {
        position: 'relative',
        '.main-panel': {
            paddingBottom: `${theme.spacing.md}px`
        },
        '.thumb-panel': {}
    };
};

export interface TimelineProps{
    pixelsPerMSec?: number;
    timeUnits?: number[];
    timeScaleHeight?: number;
    waveHeight?: number;
    duration?: number;
    currentTime?: number;
    region?: {start: number; end: number};
    selectingRegion?: boolean;
    onSeek?: (v: number) => void;
    onRegionChange?: (r: {start: number; end: number}) => void;
}

export default ({
    pixelsPerMSec, timeScaleHeight, waveHeight,
    duration, region, timeUnits, currentTime,
    selectingRegion, onSeek, onRegionChange
}: TimelineProps) => {
    const d = duration || 0;
    const ppms = pixelsPerMSec || 0.05;
    const tsh = timeScaleHeight || 48;
    const wh = waveHeight || 128;
    const r = region || { start: 3000, end: 4000 };
    const [thumbSrc, setThumbSrc] = useState('');
    return (
        <div css={timelineStyles}>
            <TimeScale />
            <WaveformPanel pixelsPerMSec={ppms} duration={d} timeScaleHeight={tsh} waveHeight={wh} region={r} />
        </div>
    );
};