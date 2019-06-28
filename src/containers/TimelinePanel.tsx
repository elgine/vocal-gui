import React, { useState } from 'react';
import { connect } from 'react-redux';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import TimeScale from '../components/Timeline/TimeScale';
import Pointer from '../components/Timeline/Pointer';
import { ACTION_SCALE_TIME } from '../store/timeline/types';
import { ACTION_SEEK } from '../store/player/types';

const timelinePanelStyles = (theme: Theme): any => {
    return {
        position: 'relative',
        boxSizing: 'border-box',
        background: `${theme.palette.mask}`,
        '.pointer': {
            position: 'absolute'
        }
    };
};

export interface TimelinePanelProps extends Omit<React.HTMLAttributes<{}>, 'css'>{
    waveHeight?: number;
    timeScaleHeight?: number;
    duration?: number;
    currentTime?: number;
    pixelsPerMSec?: number;
    scaleTime?: number;
    onScaleTimeChange: (v: number) => void;
    onSeek: (v: number) => void;
}

const mapStateToProps = ({ timeline, player, ...others }: any) => {
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

    const combinedStyle: React.CSSProperties = {
        height: `${wh + tsh}px`,
        ...style
    };
    const pointerStyle: React.CSSProperties = {
        left: `${scrollLeft + ppms * ct}px`
    };
    return (
        <div css={timelinePanelStyles} style={combinedStyle} onScroll={onPanelScroll} {...others}>
            <TimeScale className="time-scale" height={tsh} />
            <Pointer className="pointer" style={pointerStyle} />
        </div>
    );
});