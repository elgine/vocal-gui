import React, { useState, useRef, useLayoutEffect } from 'react';
import TimeScale from './TimeScale';
import Waveform from './Waveform';
import TimelineRegion from './TimelineRegion';
import Pointer from './Pointer';
import TimeLabel from './TimeLabel';
import { toTimeString } from '../../utils/time';


export interface WaveformBoxProps extends React.HTMLAttributes<{}>{
    timeScaleHeight?: number;
    waveHeight?: number;
    region?: {start: number; end: number};
    timeUnits?: number[];
    duration?: number;
    pixelsPerMSec?: number;
    currentTime?: number;
    onSeek?: (v: number) => void;
    onThumbChange?: (v: string) => void;
}

const PointerWithTimeLabel = TimeLabel(Pointer);

export default ({
    timeScaleHeight, waveHeight, region, timeUnits,
    duration, currentTime, pixelsPerMSec,
    onSeek, onThumbChange
}: WaveformBoxProps) => {
    const ct = currentTime || 0;
    const d = duration || 0;
    const r = region || { start: 0, end: d };
    const ppms = pixelsPerMSec || 0.05;
    const tsh = timeScaleHeight || 48;
    const wh = waveHeight || 128;

    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [pointerPos, setPointerPos] = useState({ left: 0, top: 0 });
    const [bounds, setBounds] = useState({ left: 0, right: 0, width: 0, top: 0, bottom: 0, height: 0 });
    // useLayoutEffect(() => {
    //     if (containerRef.current) {
    //         setBounds(containerRef.current.getBoundingClientRect());
    //         setScrollLeft(containerRef.current.scrollLeft);
    //     }
    // }, [containerRef.current]);
    const preSeek = (pointerPos.left - bounds.left + scrollLeft) / ppms;
    return (
        <div ref={containerRef}>
            <TimeScale units={timeUnits} duration={d} height={tsh} />
            <Waveform onThumbChange={onThumbChange} duration={d} height={wh} pixelsPerMSec={ppms} />
            <PointerWithTimeLabel color="rgba(255, 255, 255, 0.65)" pixelsPerMSec={ppms} time={ct} title={toTimeString(preSeek)} />
            <TimelineRegion start={r.start} end={r.end} pixelsPerMSec={ppms} />
            <PointerWithTimeLabel color="#fff" pixelsPerMSec={ppms} time={ct} title={toTimeString(ct)} />
        </div>
    );
};