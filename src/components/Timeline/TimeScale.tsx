import React, { useState, useEffect, useRef } from 'react';
import { PIXELS_PER_TIME_UNIT } from '../../constant';
import { toTimeString } from '../../utils/time';

const MAX_CANVAS_WIDTH = 8192;
const FONT_SIZE = 12;
const SPACING = 4;

const createCanvas = () => {
    let el = document.createElement('canvas');
    el.style.position = 'absolute';
    return el;
};

const calcMaxDurPerCanvas = (r: number, tu: number) => {
    return ~~(MAX_CANVAS_WIDTH / r / tu) * tu;
};

const render = (
    canvases: HTMLCanvasElement[],
    durPerCanvas: number,
    height: number,
    duration: number,
    ppms: number,
    units: number[],
    color: string,
    lastDur: number = 0,
    refresh: boolean = false
) => {
    let canvasIndex = 0;
    let offset = 0;
    const canvasW = ppms * durPerCanvas;
    const step = units[2];
    if (!refresh) {
        canvasIndex = ~~((lastDur * ppms) / canvasW);
        offset = lastDur;
    }
    while (offset < duration) {
        const start = durPerCanvas * canvasIndex;
        const to = durPerCanvas + start;
        const x = offset * ppms;
        const w = to * ppms;
        let afrom = Math.ceil(offset / step) * step;
        let aTo = ~~(to / step) * step;
        let canvas = canvases[canvasIndex];
        if (!canvas) return 0;
        let rh = 8;
        let rw = 1;
        let arh = rh;
        let arw = rw;
        let o = 0;
        let ctx = canvas.getContext('2d');
        if (!ctx) return 0;
        canvas.width = canvasW;
        canvas.height = height;
        ctx.clearRect(x, 0, w, height);
        ctx.save();
        ctx.font = `${FONT_SIZE}px Arial`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = color;
        for (;afrom < aTo; afrom += step) {
            arw = rw * 0.5;
            o = (afrom - offset) * ppms;
            if (afrom % units[0] === 0) {
                arh = rh;
                arw = rw;
                ctx.fillText(toTimeString(afrom), o, SPACING + arh);
            }
            else if (afrom % units[1] === 0) {
                arh = rh * 0.5;
            }
            else {
                arh = rh * 0.25;
                continue;
            }
            ctx.fillRect(o - arw * 0.5, 0, arw, arh);
        }
        ctx.restore();
        offset = to;
        canvasIndex++;
    }
    return lastDur;
};

export interface TimeScaleProps extends React.HTMLAttributes<{}>{
    duration?: number;
    units?: number[];
    height?: number;
    offset?: number;
    color?: string;
}

export default ({ offset, height, color, units, duration, style, children, ...others }: React.PropsWithChildren<TimeScaleProps>) => {
    const sl = offset || 0;
    const us = units || [15000, 5000, 1000];
    const d = duration || 20000;
    const h = height || 32;
    const ppms = (PIXELS_PER_TIME_UNIT / us[0]);
    const w = d * ppms;
    const [lastDur, setLastDur] = useState(0);
    const [lastPPMS, setLastPPMS] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!containerRef.current) return;
        const md = Math.ceil(Math.max(d, containerRef.current.offsetWidth / ppms));
        const maxDurPerCanvas = ~~calcMaxDurPerCanvas(ppms, us[0]);
        const canvasW = ~~(ppms * maxDurPerCanvas);
        const destCount = Math.ceil(md / maxDurPerCanvas);
        const canvases: HTMLCanvasElement[] = Array.prototype.slice.call(containerRef.current.getElementsByTagName('canvas'));
        const oldCount = canvases.length;
        if (oldCount < destCount) {
            for (let i = oldCount; i < destCount; i++) {
                let c = createCanvas();
                c.style.left = `${i * canvasW}px`;
                c.style.top = '0px';
                containerRef.current.appendChild(c);
                canvases.push(c);
            }
        }
        if (ppms !== lastPPMS || lastDur < d) {
            let res = render(
                canvases, maxDurPerCanvas, h, md, ppms, us,
                color || 'rgba(255, 255, 255, 0.45)',
                lastDur,
                ppms !== lastPPMS
            );
            if (res > 0) {
                setLastDur(res);
                setLastPPMS(ppms);
            }
        }
    }, [height, containerRef.current, d, ppms, us, lastDur, lastPPMS]);
    return (
        <div ref={containerRef} {...others}
            style={{
                transform: `translateX(-${sl}px)`,
                width: `${w}px`,
                minWidth: '100%',
                height: `${h}px`,
                overflow: 'hidden',
                ...style
            }}>
            {children}
        </div>
    );
};