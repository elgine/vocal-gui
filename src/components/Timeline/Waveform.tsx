import React, { useRef, useEffect } from 'react';
import { clamp } from 'lodash';
import { CANVAS_MAX_WIDTH } from '../../constant';

export interface WaveformProps extends React.CanvasHTMLAttributes<{}>{
    height?: number;
    pixelsPerMSec?: number;
    duration?: number;
    buffer?: Float32Array;
    color?: string;
}

export default ({ pixelsPerMSec, duration, height, buffer, color, style, ...others }: WaveformProps) => {
    const h = height || 256;
    const ppms = pixelsPerMSec || 0.05;
    const d  = duration || 0;
    const c = color || '#00ab69';
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (containerRef.current && buffer) {
            const canvases = containerRef.current.children;
            const bufCount = buffer.length;
            let w = ppms * d;
            let psr = Math.ceil(bufCount / w);
            let canvasIndex = 0;
            for (let i = 0; i < bufCount; i += psr) {
                if (i >= CANVAS_MAX_WIDTH)canvasIndex++;
                let canvas: HTMLCanvasElement;
                if (canvasIndex >= canvases.length) {
                    canvas = document.createElement('canvas');
                    containerRef.current.appendChild(canvas);
                    canvas.style.position = 'absolute';
                    canvas.style.left = `${canvasIndex * CANVAS_MAX_WIDTH}px`;
                } else {
                    canvas = canvases[canvasIndex] as HTMLCanvasElement;
                }
                canvas.width = CANVAS_MAX_WIDTH;
                canvas.height = h;
                let ctx = canvas.getContext('2d');
                if (!ctx) continue;
                ctx.clearRect(0, 0, CANVAS_MAX_WIDTH, h);
                const val = clamp(buffer[i], 0, 1);
                ctx.fillRect(i, (1 - val) * h, 1, val * h);
            }
        }
    }, [containerRef.current, buffer, ppms, d, h, c]);

    const combinedStyle: React.CSSProperties = {
        background: `linear-gradient(to bottom, transparent 0, transparent ${h * 0.5}px, rgba(255, 255, 255, 0.1) ${h * 0.5}px, rgba(255, 255, 255, 0.1) ${h * 0.5 + 1}px, transparent ${h * 0.5 + 1}px)`,
        ...style
    };
    return (
        <div ref={containerRef} style={combinedStyle} {...others}></div>
    );
};