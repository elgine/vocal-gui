import React, { useRef, useEffect } from 'react';

export interface ValueScaleProps extends Omit<React.CanvasHTMLAttributes<{}>, 'width'|'height'>{
    color?: string;
    width?: number;
    height?: number;
    dialHeight?: number;
}

export default ({ width, height, dialHeight, color }: ValueScaleProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const w = width || 32;
    const h = height || 128;
    const dh = dialHeight || 8;
    const c = color || 'rgba(255, 255, 255, 0.45)';
    useEffect(() => {
        if (canvasRef.current) {
            let ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                const ppv = h * 0.05;
                canvasRef.current.width = w;
                canvasRef.current.height = h;
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = c;
                ctx.textBaseline = 'top';
                ctx.textAlign = 'left';
                for (let i = 0; i < 20; i++) {
                    let y = ppv * i;
                    let cdh = dh;
                    if (i !== 10) {
                        cdh *= 0.5;
                    } else {
                        let v = i * 0.1 - 1;
                        ctx.fillText(v.toFixed(1), cdh, y);
                    }
                    ctx.fillRect(0, y, cdh, 1);
                }
            }
        }
    }, [canvasRef.current, w, h, dh, c]);
    return (
        <canvas ref={canvasRef}></canvas>
    );
};