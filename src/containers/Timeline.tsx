import React, { useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import WaveformThumb from '../components/Timeline/WaveformThumb';
import WaveformBox from '../components/Timeline/WaveformBox';

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
    onSeek?: (v: number) => void;
}

export default ({ pixelsPerMSec, timeScaleHeight, waveHeight, duration, region, timeUnits, currentTime, onSeek }: TimelineProps) => {
    const d = duration || 0;
    const ppms = pixelsPerMSec || 0.05;
    const tsh = timeScaleHeight || 48;
    const wh = waveHeight || 128;
    const r = region || { start: 3000, end: 4000 };
    const [thumbSrc, setThumbSrc] = useState('');
    return (
        <div css={timelineStyles}>
            <WaveformBox className="main-panel" timeUnits={timeUnits} duration={d} pixelsPerMSec={ppms}
                timeScaleHeight={tsh} waveHeight={wh} region={r} onThumbChange={setThumbSrc}
            />
            <WaveformThumb className="thumb-panel" region={r} currentTime={currentTime}
                src={thumbSrc} onSeek={onSeek}
            />
        </div>
    );
};