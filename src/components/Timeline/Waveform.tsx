import React, { useRef, useEffect } from 'react';

export interface WaveformProps extends React.CanvasHTMLAttributes<{}>{
    sampleRate?: number;
    height?: number;
    duration?: number;
    pixelsPerMSec?: number;
}

export default ({ sampleRate, pixelsPerMSec, height, style, ...others }: WaveformProps) => {
    const sr = sampleRate || 0.05;
    const h = height || 256;
    const ppms = pixelsPerMSec || 0.05;
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (containerRef.current) {

        }
    }, [containerRef.current]);
    const combinedStyle: React.CSSProperties = {
        height: `${h}px`,
        ...style
    };
    return (
        <div ref={containerRef} style={combinedStyle} {...others}></div>
    );
};