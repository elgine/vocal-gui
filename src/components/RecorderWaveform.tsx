import React, { useRef, useEffect, useCallback } from 'react';
import { clamp } from 'lodash';
import { getRecorder } from '../processor';

const WIDTH = 600;
const HEIGHT = 400;
const BAR_WIDTH = 2;
const INTERVAL = 2;

export interface RecorderWaveformProps extends React.HTMLAttributes<{}>{
    color?: string;
    sampleRate?: number;
}

export default React.memo(({ color, sampleRate, style, ...others }: RecorderWaveformProps) => {
    const recorder = getRecorder();
    const offscreenRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sampleRateRef = useRef(5);
    const colorRef = useRef(color || '#df372e');
    if (color) {
        colorRef.current = color;
    }
    if (sampleRate) {
        sampleRateRef.current = sampleRate;
    }
    useEffect(() => {
        if (!canvasRef.current || !offscreenRef.current) return;
        let canvas = canvasRef.current;
        let offscreenCanvas = offscreenRef.current;
        canvas.width = offscreenCanvas.width = WIDTH;
        canvas.height = offscreenCanvas.height = HEIGHT;
    }, [canvasRef.current, offscreenRef.current]);
    const drawWaveform = useCallback((buffer: Float32Array) => {
        if (!canvasRef.current || !offscreenRef.current || !buffer) return;
        let canvas = canvasRef.current;
        let ctx = canvas.getContext('2d');
        let offscreenCanvas = offscreenRef.current;
        let offscreenCtx = offscreenCanvas.getContext('2d');
        if (!ctx || !offscreenCtx) return;
        const c = colorRef.current;
        const bufferCount = buffer.length;
        const bufferCountResampled = sampleRateRef.current;
        const resampleInterval = Math.ceil(bufferCount / bufferCountResampled);
        const width = bufferCountResampled * (BAR_WIDTH + INTERVAL);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(-width, 0);
        ctx.drawImage(offscreenCanvas, 0, 0);
        ctx.restore();
        // Draw new wave
        ctx.save();
        ctx.fillStyle = c;
        ctx.translate(canvas.width - width, 0);
        for (let i = 0, p = 0; i < bufferCount; i += resampleInterval, p += BAR_WIDTH + INTERVAL) {
            let val = clamp(Math.abs(buffer[i]), 0.01, 1);
            ctx.fillRect(p, (1 - val) * HEIGHT * 0.5, BAR_WIDTH, val * HEIGHT);
        }
        ctx.restore();
        // Cache
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        offscreenCtx.drawImage(canvas, 0, 0);
    }, [canvasRef.current, offscreenRef.current]);
    const onAudioDataProcess = useCallback((buffer: AudioBuffer) => drawWaveform(buffer.getChannelData(0)), [drawWaveform]);

    useEffect(() => {
        recorder && recorder.onProcess.on(onAudioDataProcess);
        return () => {
            recorder && recorder.onProcess.off(onAudioDataProcess);
        };
    }, [recorder, onAudioDataProcess]);
    return (
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', ...style }} {...others}></canvas>
    );
}, (prevProps: RecorderWaveformProps, nextProps: RecorderWaveformProps) => {
    return (prevProps.sampleRate === nextProps.sampleRate && prevProps.color === nextProps.color);
});