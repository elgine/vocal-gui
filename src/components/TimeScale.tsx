import React, { useState, useEffect, useRef } from 'react';
import { TIME_UNITS, PIXELS_PER_TIME_UNIT } from '../constant';
import { toTimeString } from '../utils/time';

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
    dialLen: number,
    ppms: number,
    units: number[],
    colors: string[],
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
        let rh = dialLen;
        let rw = 1;
        let arh = rh;
        let o = 0;
        let c = '';
        let drawText = false;
        let ctx = canvas.getContext('2d');
        if (!ctx) return 0;
        canvas.width = canvasW;
        canvas.height = height;
        ctx.clearRect(x, 0, w, height);
        ctx.save();
        ctx.font = `${FONT_SIZE}px Arial`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        for (;afrom < aTo; afrom += step) {
            o = (afrom - offset) * ppms;
            drawText = false;
            if (afrom % units[0] === 0) {
                drawText = true;
                arh = rh;
                c = colors[0];
            }
            else if (afrom % units[1] === 0) {
                arh = rh * 0.7;
                c = colors[1];
            }
            else {
                arh = rh * 0.5;
                c = colors[2];
            }
            ctx.fillStyle = c;
            if (drawText) { ctx.fillText(toTimeString(afrom), o, height - (SPACING + arh)) }
            ctx.fillRect(o - rw * 0.5, height - arh, rw, arh);
        }
        ctx.restore();
        offset = to;
        canvasIndex++;
    }
    return lastDur;
};

export interface TimeScaleProps extends React.HTMLAttributes<{}>{
    duration?: number;
    pixelsPerMSec?: number;
    timeUnits?: number[];
    colors?: string[];
    height?: number;
    offset?: number;
    dialLen?: number;
}

export default ({ pixelsPerMSec, offset, height, colors, timeUnits, duration, dialLen, style, children, ...others }: React.PropsWithChildren<TimeScaleProps>) => {
    const sl = offset || 0;
    const us = timeUnits || TIME_UNITS;
    const d = duration || 20000;
    const h = height || 40;
    const ppms = pixelsPerMSec || (PIXELS_PER_TIME_UNIT / us[0]);
    const w = d * ppms;
    const cs = colors || ['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.12)'];
    const dl = dialLen || 16;
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
                canvases, maxDurPerCanvas, h, md, dl, ppms, us,
                cs,
                lastDur,
                ppms !== lastPPMS
            );
            if (res > 0) {
                setLastDur(res);
                setLastPPMS(ppms);
            }
        }
    }, [height, containerRef.current, d, ppms, us, cs, lastDur, lastPPMS]);
    return (
        <div ref={containerRef} {...others}
            style={{
                transform: `translateX(-${sl}px)`,
                width: `${w}px`,
                minWidth: '100%',
                height: `${h}px`,
                overflow: 'hidden',
                boxSizing: 'border-box',
                borderBottom: `1px solid ${cs[2]}`,
                ...style
            }}>
            {children}
        </div>
    );
};