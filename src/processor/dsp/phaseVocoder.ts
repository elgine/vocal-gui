import { clamp } from 'lodash';
import OverlapAdd from './overlapAdd';
import { WindowType } from '../window';
import fft from './fft';
import { calculateMagnitude, calculatePhase } from './frequencyCalculator';
import resample from './resample';
import wrapToPI from './wrapToPI';

// const resample = (src: Float32Array, n: number, scalar: number, dst: Float32Array) => {
//     const srcLength = src.length;
//     for (let i = 0; i < n; ++i) {
//         let j = i / scalar;
//         let j1 = Math.floor(j);
//         let j2 = Math.ceil(j);
//         if (j1 >= srcLength) {
//             j1 = j1 = srcLength - 1;
//         }
//         if (j2 >= srcLength) {
//             j2 = j2 = srcLength - 1;
//         }

//         if (j1 < 0)j1 = 0;
//         if (j2 < 0)j2 = 0;

//         let w = j - j1;
//         dst[i] = src[j1] * w + src[j2] * (1 - w);
//     }
//     return n;
// };

export interface PhaseVocoderOptions{
    pitch: number;
    tempo: number;
}

export default class PhaseVocoder extends OverlapAdd {

    static PITCH_DEFAULT =1;
    static PITCH_MIN = 0.5;
    static PITCH_MAX = 2;

    static TEMPO_DEFAULT = 1;
    static TEMPO_MIN = 0.5;
    static TEMPO_MAX = 2;

    private _omega: Float32Array;
    private _real: Float32Array;
    private _imag: Float32Array;
    private _lastPhase: Float32Array;
    private _newPhase: Float32Array;

    private _stretch: number = 1;
    private _pitch: number = 1;
    private _tempo: number = 1;

    private _out: Float32Array;

    constructor(frameSize: number, overlap: number = 0.25, winType: WindowType = WindowType.HANNING) {
        super(frameSize, frameSize * overlap, frameSize * overlap, winType);
        this._real = new Float32Array(this._frameSize);
        this._imag = new Float32Array(this._frameSize);
        this._lastPhase = new Float32Array(this._frameSize);
        this._newPhase = new Float32Array(this._frameSize);
        this._out = new Float32Array(this._frameSize * 2);

        this._omega = new Float32Array(this._frameSize);
        for (let i = 0; i < this._frameSize; i++) {
            this._omega[i] = Math.PI * 2 * this._hopA * i / this._frameSize;
        }
    }

    set(v: AnyOf<PhaseVocoderOptions>) {
        if (v.pitch) {
            this.pitch = clamp(v.pitch, PhaseVocoder.PITCH_MIN, PhaseVocoder.PITCH_MAX);
        }
        if (v.tempo) {
            this.tempo = clamp(v.tempo, PhaseVocoder.TEMPO_MIN, PhaseVocoder.TEMPO_MAX);
        }
    }

    set pitch(v: number) {
        if (this._pitch === v) return;
        this._pitch = v;
        this._updateHotSize();
    }

    get pitch() {
        return this._pitch;
    }

    set tempo(v: number) {
        if (this._tempo === v) return;
        this._tempo = v;
        this._updateHotSize();
    }

    get tempo() {
        return this._tempo;
    }

    protected _pushToOutputQueue(buffer: Float32Array, len: number) {
        let bufferLen: number = len;
        if (this._pitch === 1) {
            this._out.set(buffer);
        } else {
            bufferLen = Math.round(this._hopA * this._tempo);
            let ratio = 1 / (this._hopS / bufferLen);
            resample(buffer, len, bufferLen, ratio, this._out);
        }
        super._pushToOutputQueue(this._out, bufferLen);
    }

    protected _analyse() {
        this._shiftWindow(this._frame);
        this._real.set(this._frame);
        this._imag.fill(0);
        fft(this._real, this._imag, 1);
    }

    protected _processing() {
        for (let i = 0; i < this._frameSize; i++) {
            let magn = calculateMagnitude(this._real[i], this._imag[i]);
            let phase = calculatePhase(this._real[i], this._imag[i]);
            let diff = wrapToPI(phase - this._lastPhase[i] - this._omega[i]);
            let freq_diff = this._omega[i] + diff;
            let new_phase = wrapToPI(this._newPhase[i] + freq_diff * this._stretch);
            this._newPhase[i] = new_phase;
            this._lastPhase[i] = phase;
            this._real[i] = Math.cos(new_phase) * magn;
            this._imag[i] = Math.sin(new_phase) * magn;
        }
    }

    protected _synthesis() {
        fft(this._real, this._imag, -1);
        this._frame.set(this._real);
        this._shiftWindow(this._frame);
    }

    protected _shiftWindow(data: Float32Array|number[]) {
        const len = data.length;
        const halfLen = len / 2;
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
    }

    private _updateHotSize() {
        this._hopS = Math.round(Math.round(this._hopA * this._tempo) * this._pitch);
        this._stretch = this._hopS / this._hopA;
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