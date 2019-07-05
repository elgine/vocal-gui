import React from 'react';
import TimeScale from '../components/Timeline/TimeScale';
import Waveform from '../components/Timeline/Waveform';
import Pointer from '../components/Timeline/Pointer';
import TimelineRegion from '../components/Timeline/TimelineRegion';
import { withTheme } from 'emotion-theming';
import Label from '../components/Label';
import PointerWithLabel from '../components/Timeline/PointerWithLabel';
import { toTimeString } from '../utils/time';

export interface WaveformPanelProps extends React.HTMLAttributes<{}>{
    currentTime?: number;
    pixelsPerMSec?: number;
    timeUnits?: number[];
    timeScaleHeight?: number;
    waveHeight?: number;
    duration?: number;
    region?: Segment;
}

export default withTheme(({ duration, region, pixelsPerMSec, timeUnits, currentTime, timeScaleHeight, waveHeight, style, theme, ...others }: WaveformPanelProps & {theme: Theme}) => {
    const ct = currentTime || 2000;
    const d = duration || 0;
    const ppms = pixelsPerMSec || 0.05;
    const tsh = timeScaleHeight || 48;
    const wh = waveHeight || 128;
    const r = region || { start: 3000, end: 4000 };
    const onEnter = (e: React.MouseEvent) => {

    };
    const onLeave = (e: React.MouseEvent) => {};
    return (
        <div style={{ position: 'relative', ...style }} onMouseEnter={onEnter} onMouseLeave={onLeave} {...others}>
            <Waveform pixelsPerMSec={ppms} duration={d} height={wh} />
            <PointerWithLabel labelVisible flat color="rgba(255, 255, 255, 0.45)" />
            {/* <PointerWithLabel hasHeader label={toTimeString(ct)} color="#d3a82a" style={{ left: `${ct * ppms}px` }} />
            <TimelineRegion region={r} pixelsPerMSec={ppms} /> */}
        </div>
    );
});