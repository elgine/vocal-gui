import React, { useState } from 'react';
import { connect } from 'react-redux';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import TimeScale from '../components/Timeline/TimeScale';
import Pointer from '../components/Timeline/Pointer';
import { ACTION_SCALE_TIME } from '../store/timeline/types';
import { ACTION_SEEK } from '../store/player/types';
import Waveform from '../components/Timeline/Waveform';
import TimelineRegion from '../components/Timeline/TimelineRegion';

const timelinePanelStyles = (theme: Theme): any => {
    return {
        position: 'relative',
        boxSizing: 'border-box',
        background: `${theme.palette.mask.dark}`,
        '.pointer': {
            position: 'absolute'
        }
    };
};

export interface TimelinePanelProps extends React.HTMLAttributes<{}>{
    waveHeight?: number;
    timeScaleHeight?: number;
    duration?: number;
    currentTime?: number;
    pixelsPerMSec?: number;
    scaleTime?: number;
    onScaleTimeChange: (v: number) => void;
    onSeek: (v: number) => void;
}

const mapStateToProps = ({ timeline, player }: any) => {
    return {
        pixelsPerMSec: timeline.pixelsPerMSec,
        currentTime: player.currentTime,
        duration: timeline.duration,
        scaleTime: timeline.scaleTime
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onScaleTimeChange: dispatch.timeline[ACTION_SCALE_TIME],
        onSeek: dispatch.player[ACTION_SEEK]
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(({
    waveHeight, currentTime, timeScaleHeight, duration, style,
    pixelsPerMSec, scaleTime,
    onScroll, onSeek, onScaleTimeChange, ...others
}: TimelinePanelProps) => {
    const wh = waveHeight || 256;
    const tsh = timeScaleHeight || 32;
    const d = duration || 0;
    const ct = currentTime || 0;
    const ppms = pixelsPerMSec || 0.05;

    const [scrollLeft, setScrollLeft] = useState(0);
    const onPanelScroll = (e: React.UIEvent<HTMLDivElement>) => {
        let el = e.target as HTMLElement;
        setScrollLeft(el.offsetLeft);
        onScroll && onScroll(e);
    };

    const [regionStart, setRegionStart] = useState(0);
    const [regionEnd, setRegionEnd] = useState(0);
    const onRegionChange = (region: {start?: number; end?: number}) => {
        if (region.start !== undefined)setRegionStart(region.start);
        if (region.end !== undefined)setRegionEnd(region.end);
    };

    const combinedStyle: React.CSSProperties = {
        height: `${wh + tsh}px`,
        ...style
    };
    const regionStyle: React.CSSProperties = {
        left: `${scrollLeft}px`
    };
    const pointerStyle: React.CSSProperties = {
        left: `${scrollLeft + ppms * ct}px`
    };
    return (
        <div css={timelinePanelStyles} style={combinedStyle} onScroll={onPanelScroll} {...others}>
            <TimeScale className="time-scale" height={tsh} />
            <Waveform duration={d} height={wh} />
            <TimelineRegion start={regionStart} end={regionEnd} pixelsPerMSec={ppms} style={regionStyle} onRegionChange={onRegionChange} />
            <Pointer className="pointer" style={pointerStyle} />
        </div>
    );
});