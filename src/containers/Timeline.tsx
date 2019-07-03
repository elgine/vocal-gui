import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdAudiotrack } from 'react-icons/md';
import TimeScale from '../components/Timeline/TimeScale';
import Waveform from '../components/Timeline/Waveform';
import Button from '../components/Button';
import ControlBar from '../components/ControlBar';

const timelineStyles = (theme: Theme): any => {
    return {
        position: 'relative',
        '.value-scale': {

        }
    };
};

export interface TimelineProps{
    pixelsPerMSec?: number;
    timeUnits?: number[];
    timeScaleHeight?: number;
    waveHeight?: number;
}

export default ({ pixelsPerMSec, timeScaleHeight, waveHeight, timeUnits }: TimelineProps) => {
    const ppms = pixelsPerMSec || 0.05;
    const tsh = timeScaleHeight || 48;
    const contentStyle: React.CSSProperties = {
        overflowX: 'auto'
    };
    return (
        <div css={timelineStyles}>
            <div>

            </div>
            <div style={contentStyle}>
                <TimeScale units={timeUnits} height={tsh} />
                <Waveform height={waveHeight} pixelsPerMSec={ppms} />
            </div>
        </div>
    );
};