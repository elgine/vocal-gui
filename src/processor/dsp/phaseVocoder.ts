import { clamp } from 'lodash';
import OverlapAdd from './overlapAdd';
import { WindowType } from '../window';
import fft from './fft';
import { calculateMagnitude, calculatePhase } from './frequencyCalculator';
import resample from './resample';
import wrapToPI from './wrapToPI';

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

    private _stretch!: number;
    private _pitch: number = 1;
    private _tempo: number = 1;

    private _overlap: number = 0.25;

    private _out: Float32Array;

    constructor(frameSize: number, overlap: number = 0.25, winType: WindowType = WindowType.HANNING) {
        super(frameSize, frameSize * overlap, frameSize * overlap, winType);
        this._omega = new Float32Array(this._frameSize);
        this._real = new Float32Array(this._frameSize);
        this._imag = new Float32Array(this._frameSize);
        this._lastPhase = new Float32Array(this._frameSize);
        this._newPhase = new Float32Array(this._frameSize);
        this._out = new Float32Array(this._frameSize * 2);
        this._updateOmega();
    }

    set(v: AnyOf<PhaseVocoderOptions>) {
        if (v.pitch) {
            this.pitch = clamp(v.pitch, PhaseVocoder.PITCH_MIN, PhaseVocoder.PITCH_MAX);
        }
        if (v.tempo) {
            this.tempo = clamp(v.tempo, PhaseVocoder.TEMPO_MIN, PhaseVocoder.TEMPO_MAX);
        }
    }

    set overlap(v: number) {
        if (this._overlap === v) return;
        this._overlap = v;
        this._hopA = this._frameSize * this._overlap;
        this._updateHotSize();
        this._updateOmega();
    }

    get overlap() {
        return this._overlap;
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

    protected _pushToOutputQueue(buffer: Float32Array|number[], len: number) {
        let frameLen = Math.round(this._hopA);
        resample(buffer, len, frameLen, this._out);
        super._pushToOutputQueue(this._out, frameLen);
    }

    protected _analyse() {
        this._shiftWindow(this._frame);
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

    private _updateOmega() {
        for (let i = 0; i < this._frameSize; i++) {
            this._omega[i] = Math.PI * 2 * this._hopA * i / this._frameSize;
        }
    }

    private _updateHotSize() {
        this._stretch = this._pitch * this._tempo;
        this._hopS = Math.floor(this._hopA * this._stretch);
        this._stretch = this._hopS / this._hopA;
    }
}

export const phaseVocoderDescriptor = {
    pitch: {
        min: PhaseVocoder.PITCH
    }
};

export const phaseVocoderDefaultOptions = {
    pitch: 1,
    tempo: 1
};