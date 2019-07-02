import React, { useState } from 'react';
import { connect } from 'react-redux';
import TimeScale from '../components/Timeline/TimeScale';
import Pointer from '../components/Timeline/Pointer';
import { ACTION_SCALE_TIME } from '../store/timeline/types';
import { ACTION_SEEK } from '../store/player/types';
import Waveform from '../components/Timeline/Waveform';
import TimelineRegion from '../components/Timeline/TimelineRegion';
import { Row } from '../components/Grid';
import UploadZone from '../components/UploadZone';
import { SUPPORT_MIME } from '../constant';
import Tooltip from '../components/Tooltip';
import { toTimeString } from '../utils/time';

export interface TimelinePanelProps extends React.HTMLAttributes<{}>{
    waveBuffer?: Float32Array;
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
    waveHeight, currentTime, timeScaleHeight, duration,
    pixelsPerMSec, scaleTime, waveBuffer, style,
    onScroll, onSeek, onScaleTimeChange, ...others
}: TimelinePanelProps) => {
    const wh = waveHeight || 256;
    const tsh = timeScaleHeight || 48;
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
    const containerStyle: React.CSSProperties  = {
        position: 'relative',
        boxSizing: 'border-box',
        overflowX: 'auto',
        ...style
    };
    const timeScaleStyle: React.CSSProperties = {
        borderBottom: `1px solid #222`
    };
    const waveformContainerStyle: React.CSSProperties = {
        height: `calc(100% - ${tsh}px)`
    };
    const regionStyle: React.CSSProperties = {
        left: `${scrollLeft}px`
    };
    const pointerStyle: React.CSSProperties = {
        left: `${scrollLeft + ppms * ct}px`
    };
    return (
        <div onScroll={onPanelScroll} style={containerStyle} {...others}>
            <TimeScale style={timeScaleStyle} height={tsh} />
            <Row verticalAlign="middle" style={waveformContainerStyle}>
                {
                    waveBuffer ? <Waveform buffer={waveBuffer} duration={d} height={wh} /> : (
                        <UploadZone accept={SUPPORT_MIME} style={{ width: '100%', height: '100%' }} />
                    )
                }
            </Row>
            <TimelineRegion start={regionStart} end={regionEnd} pixelsPerMSec={ppms}
                style={regionStyle} onRegionChange={onRegionChange}
            />
            <Tooltip title={toTimeString(ct)} anchorPos={{ vertical: 'top', horizontal: 'center' }}
                transformPos={{ vertical: 'bottom', horizontal: 'center' }}>
                <Pointer style={pointerStyle} />
            </Tooltip>
        </div>
    );
});