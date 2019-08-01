import { clamp } from 'lodash';
import window, { WindowType } from './window';
import fft from './fft';

export interface PhaseVocoderOptions{
    pitch: number;
    tempo: number;
}

// Phase vocoder algorithm.
// Inspired by guitar pitch shifter, http://www.guitarpitchshifter.com/algorithm.html
// Usage: constructor -> initialize -> process
export default class PhaseVocoder {

    static PITCH_DEFAULT =1;
    static PITCH_MIN = 0.5;
    static PITCH_MAX = 2;

    static TEMPO_DEFAULT = 1;
    static TEMPO_MIN = 0.5;
    static TEMPO_MAX = 2;

    private _frameSize: number = 1024;
    private _overlap: number = 0.25;

    private _pitch: number = 1;
    private _tempo: number = 1;
    private _stretch: number = 1;

    private _ht: number = 256;
    private _ha: number = 256;
    private _hs: number = 256;

    private _frame: Float32Array;
    private _window: Float32Array;
    private _omega: Float32Array;
    private _prevInPhase: Float32Array;
    private _prevOutPhase: Float32Array;
    private _real: Float32Array;
    private _imag: Float32Array;
    private _last: number[];

    private _inputQueue: number[] = [];
    private _outputQueue: number[] = [];

    constructor(fftSize: number, overlap: number = 0.25, winType: WindowType = WindowType.HANNING) {
        this._frameSize = fftSize || 1024;
        this._overlap = overlap || 0.25;
        this._hs = this._ht = this._ha = Math.round(this._frameSize * this._overlap);
        this._frame = new Float32Array(this._frameSize);
        this._real = new Float32Array(this._frameSize);
        this._imag = new Float32Array(this._frameSize);
        this._window = new Float32Array(this._frameSize);
        this._omega = new Float32Array(this._frameSize);
        this._prevInPhase = new Float32Array(this._frameSize);
        this._prevOutPhase = new Float32Array(this._frameSize);
        this._last = new Array<number>(this._frameSize);
        window(this._window, winType);
        for (let i = 0; i < this._frameSize; i++) {
            this._omega[i] = (Math.PI * 2 * this._ha * i / this._frameSize);
            this._last[i] = 0.0;
            this._prevOutPhase[i] = 0.0;
        }
    }

    process(frame: Float32Array) {
        frame.forEach((f) => this._inputQueue.push(f));
        while (this._inputQueue.length >= this._frameSize) {
            for (let i = 0; i < this._frameSize; i++) {
                this._frame[i] = this._inputQueue[i];
            }
            Array.prototype.push.apply(this._outputQueue, this.processFrame(this._frame));
            this._inputQueue.splice(0, this._ha);
        }
    }

    pop(b: Float32Array, size: number) {
        if (this._outputQueue.length >= size) {
            const out = this._outputQueue.splice(0, size);
            b.set(out);
            return size;
        }
        return 0;
    }

    processFrame(buffer: Float32Array) {
        let output: number[];
        const hopSize = Math.round(this._stretch * this._ha);
        buffer = this._pvStep(this._stretch, buffer);
        let chunk = this._overlapAdd(hopSize, buffer);
        if (this._pitch !== 1.0) {
            output = this._resample(chunk, this._ht, 1.0000 / this._pitch);
        } else {
            output = chunk;
        }
        return output;
    }

    set(options: AnyOf<PhaseVocoderOptions>) {
        if (options.pitch !== undefined) {
            this.pitch = clamp(options.pitch, PhaseVocoder.PITCH_MIN, PhaseVocoder.PITCH_MAX);
        }
        if (options.tempo !== undefined) {
            this.tempo = clamp(options.tempo, PhaseVocoder.TEMPO_MIN, PhaseVocoder.TEMPO_MAX);
        }
    }

    clear() {
        this._outputQueue.length = 0;
        this._inputQueue.length = 0;
        this._last.fill(0);
    }

    /**
     * Resample, simple linear interpolation method
     * @param src
     * @param n
     * @param scalar
     * @returns {Array}
     * @private
     */
    private _resample(src: Float32Array|number[], n: number, scalar: number) {
        const srcLength = src.length;
        let dst: number[] = [];
        for (let i = 0; i < n; ++i) {
            let j = i / scalar;
            let j1 = Math.floor(j);
            let j2 = Math.ceil(j);
            if (j1 >= srcLength) {
                j1 = j1 = srcLength - 1;
            }
            if (j2 >= srcLength) {
                j2 = j2 = srcLength - 1;
            }

            if (j1 < 0)j1 = 0;
            if (j2 < 0)j2 = 0;

            let w = j - j1;
            dst[i] = src[j1] * w + src[j2] * (1 - w);
        }

        return dst;
    }

    private _pvStep(stretchFactor: number, frame: Float32Array) {
        // Do windowing
        for (let i = 0; i < this._frameSize; i++) {
            frame[i] = frame[i] * this._window[i];
        }

        // Shift frame after windowing ensure the window not at the left-most position.
        frame = this._shiftWindow(frame);

        // Do Fft forward translation
        // this._fft.forward(frame);
        this._real.set(frame);
        this._imag.fill(0);
        fft(this._real, this._imag, 1);

        // Calculate newPhase (including )
        for (let i = 0; i < this._frameSize; i++) {
            let magn = this._getMagnitude(this._real[i], this._imag[i]);
            let phase = this._getPhase(this._real[i], this._imag[i]);
            let diff = phase - this._prevInPhase[i] - this._omega[i];
            let freqDiff = this._omega[i] + this._mapPhaseIntoInterval(diff);
            let newPhase = this._mapPhaseIntoInterval(this._prevOutPhase[i] + freqDiff * stretchFactor);
            this._prevOutPhase[i] = newPhase;
            this._prevInPhase[i] = phase;

            this._real[i] = Math.cos(newPhase) * magn;
            this._imag[i] = Math.sin(newPhase) * magn;
        }

        // frame = this._fft.inverse(null,null);
        fft(this._real, this._imag, -1);
        frame.set(this._real);

        frame = this._shiftWindow(frame);
        for (let i = 0; i < frame.length; i++) {
            frame[i] = frame[i] * this._window[i];
        }
        return frame;
    }

    private _overlapAdd(hopSize: number, frame: Float32Array) {
        const frameLength = frame.length;
        let finishedBytes: number[] = [];
        for (let i = 0; i < hopSize; i++) {
            finishedBytes.push(this._last.shift() as number);
            this._last.push(0.0);
        }

        for (let i = 0; i < frameLength; i++) {
            this._last[i] += frame[i];
        }
        return finishedBytes;
    }

    private _getMagnitude(real: number, imag: number) {
        return Math.sqrt(Math.pow(real, 2) + Math.pow(imag, 2));
    }

    private _getPhase(real: number, imag: number) {
        return Math.atan2(imag, real);
    }

    private _shiftWindow(data: Float32Array) {
        let len = data.length;
        let halfLen = len / 2;
        if (len % 2 === 0) {
            for (let i = 0; i < halfLen; i++) {
                let tmp = data[i];
                data[i] = data[i + halfLen];
                data[i + halfLen] = tmp;
            }
        } else {
            let shiftAmt = halfLen;
            let remaining = len;
            let curr = 0;
            let save = data[curr];
            while (remaining >= 0) {
                let next = data[(curr + shiftAmt) % len];
                data[(curr + shiftAmt) % len] = save;
                save = next;
                curr = (curr + shiftAmt) % len;
                remaining--;
            }
        }
        return data;
    }

    private _mapPhaseIntoInterval(phase) {
        return (phase + Math.PI) % (-Math.PI * 2) + Math.PI;
    }

    set pitch(p: number) {
        if (this._pitch === p) return;
        this._pitch = p;
        this._hs = Math.round(this._pitch * this._ht);
        this._stretch = this._hs / this._ha;
    }

    set tempo(t: number) {
        if (this._tempo === t) return;
        this._tempo = t;
        this._ht = Math.round(this._ha * this._tempo);
        this._hs = Math.round(this._pitch * this._ht);
        this._stretch = this._hs / this._ha;
    }

    get ha() {
        return this._ha;
    }

    get hs() {
        return this._hs;
    }
}

export const phaseVocoderDescriptor = {
    pitch: {
        min: PhaseVocoder.PITCH_MIN,
        max: PhaseVocoder.PITCH_MAX,
        key: 'pitch',
        title: 'PITCH'
    },
    tempo: {
        min: PhaseVocoder.TEMPO_MIN,
        max: PhaseVocoder.TEMPO_MAX,
        key: 'tempo',
        title: 'TEMPO'
    }
};

export const phaseVocoderDefaultOptions = {
    pitch: 1,
    tempo: 1
};