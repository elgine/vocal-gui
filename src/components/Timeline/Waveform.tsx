import React, { useRef, useEffect } from 'react';
import { clamp } from 'lodash';
import { CANVAS_MAX_WIDTH } from '../../constant';

export interface WaveformProps extends Omit<React.CanvasHTMLAttributes<{}>, 'onChange'>{
    height?: number;
    pixelsPerMSec?: number;
    duration?: number;
    buffer?: Float32Array;
    color?: string;
    onThumbChange?: (base64Url: string) => void;
}

export default ({ pixelsPerMSec, duration, height, buffer, color, style, onThumbChange, ...others }: WaveformProps) => {
    const h = height || 256;
    const ppms = pixelsPerMSec || 0.05;
    const d  = duration || 0;
    const c = color || '#42d496';
    const containerRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    useEffect(() => {
        if (containerRef.current && buffer) {
            const canvases = containerRef.current.getElementsByTagName('canvas');
            const bufCount = buffer.length;
            let w = ppms * d;
            let psr = Math.ceil(bufCount / w);
            let canvasIndex = -1;
            let canvas: HTMLCanvasElement;
            let ctx: CanvasRenderingContext2D | null = null;
            for (let i = 0, p = 0; i < bufCount; i += psr, p++) {
                const val = clamp(buffer[i], 0, 1);
                if (p === 0 || p >= CANVAS_MAX_WIDTH) {
                    p %= CANVAS_MAX_WIDTH;
                    if (i !== 0 && ctx) {
                        ctx.stroke();
                    }
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
                    ctx.strokeStyle = c;
                    ctx.beginPath();
                    ctx.moveTo(p, h * (1 - val));
                } else {
                    if (!ctx) continue;
                    ctx.lineTo(p, h * (1 - val));
                }
            }
            if (thumbRef.current) {
                onThumbChange && onThumbChange(thumbRef.current.toDataURL());
            }
        }
    }, [containerRef.current, buffer, ppms, d, h, c, thumbRef.current, onThumbChange]);

    const combinedStyle: React.CSSProperties = {
        background: `linear-gradient(to bottom, transparent 0, transparent ${h * 0.5}px, rgba(255, 255, 255, 0.1) ${h * 0.5}px, rgba(255, 255, 255, 0.1) ${h * 0.5 + 1}px, transparent ${h * 0.5 + 1}px)`,
        ...style
    };
    return (
        <div ref={containerRef} style={combinedStyle} {...others}></div>
    );
};