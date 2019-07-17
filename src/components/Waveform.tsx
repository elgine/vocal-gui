import React, { useRef, useEffect } from 'react';
import { clamp } from 'lodash';
import { CANVAS_MAX_WIDTH } from '../constant';
import { fade } from '../utils/color';

export interface WaveformProps extends Omit<React.CanvasHTMLAttributes<{}>, 'onChange'>{
    height?: number;
    pixelsPerMSec?: number;
    duration?: number;
    buffer?: Float32Array;
    color?: string;
    onThumbChange?: (canvases: HTMLCollection) => void;
}

export default ({ pixelsPerMSec, duration, height, buffer, color, onThumbChange, style, ...others }: WaveformProps) => {
    const h = height || 256;
    const ppms = pixelsPerMSec || 0.05;
    const d  = duration || 0;
    const c = color || 'rgba(200, 200, 200, 0.4)';
    const containerRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    useEffect(() => {
        if (containerRef.current && buffer) {
            const canvases = containerRef.current.getElementsByTagName('canvas');
            const bufCount = buffer.length;
            let w = ppms * d;
            let psr = w > 0 ? Math.ceil(bufCount / w) : 0;
            let canvasIndex = -1;
            let canvas: HTMLCanvasElement;
            let ctx: CanvasRenderingContext2D | null = null;
            if (psr <= 0) return;
            for (let i = 0, p = 0; i < bufCount; i += psr, p++) {
                const val = clamp(buffer[i], -1, 1);
                const y = (1 - val) * 0.5 * h;
                if (p === 0 || p >= CANVAS_MAX_WIDTH) {
                    p %= CANVAS_MAX_WIDTH;
                    if (++canvasIndex >= canvases.length) {
                        canvas = document.createElement('canvas');
                        containerRef.current.appendChild(canvas);
                        canvas.style.position = 'absolute';
                        canvas.style.left = `${canvasIndex * CANVAS_MAX_WIDTH}px`;
                    } else {
                        canvas = canvases[canvasIndex] as HTMLCanvasElement;
                    }
                    canvas.width = CANVAS_MAX_WIDTH;
                    canvas.height = h;
                    ctx = canvas.getContext('2d');
                    if (!ctx) continue;
                    ctx.clearRect(0, 0, CANVAS_MAX_WIDTH, h);
                    ctx.fillStyle = c;
                }
                if (!ctx) continue;
                ctx.fillRect(p, y, 1, h - 2 * y);
            }
            if (thumbRef.current) {
                onThumbChange && onThumbChange(canvases);
            }
            // if (ctx && !stroked) {
            //     ctx.stroke();
            // }
        }
    }, [containerRef.current, buffer, ppms, d, h, c, thumbRef.current, onThumbChange]);
    return (
        <div ref={containerRef} style={{ position: 'relative', width: `${ppms * d}px`, overflow: 'hidden', height: `${h}px`, ...style }} {...others}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                width: '100%',
                height: '1px',
                backgroundColor: fade(c, 0.2)
            }}></div>
        </div>
    );
};