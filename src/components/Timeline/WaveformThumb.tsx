import React from 'react';
import Pointer from './Pointer';

export interface WaveformThumbProps extends React.HTMLAttributes<{}>{
    src?: string;
    height?: number;
    region?: {start: number; end: number};
    duration?: number;
    pixelsPerMSec?: number;
    currentTime?: number;
    onSeek?: (v: number) => void;
}

export default ({ src, height, style, region, duration, currentTime, pixelsPerMSec, onSeek, ...others }: WaveformThumbProps) => {
    const h = height || 32;
    const d = duration || 0;
    const ppms = pixelsPerMSec || 0.05;
    const r = region || { start: 0, end: d };
    const combinedStyle: React.CSSProperties = {
        height: `${h}px`,
        ...style
    };
    const startPointerStyle: React.CSSProperties = {
        left: `${ppms * r.start}px`
    };
    const endPointerStyle: React.CSSProperties = {
        left: `${ppms * r.end}px`
    };
    return (
        <div style={combinedStyle} {...others}>
            <img style={{ width: '100%', height: '100%' }} />
            <Pointer hasHeader color="#42d496" style={startPointerStyle} />
            <Pointer hasHeader color="#42d496" style={endPointerStyle} />
        </div>
    );
};