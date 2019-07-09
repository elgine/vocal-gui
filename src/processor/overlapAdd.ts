import generateWin, { WindowType } from './window';

export default class OverlapAdd {

    private _hopA: number;
    private _hopS: number;
    private _inputQueue: Float32Array;
    private _outputQueue: Float32Array;
    private _out: Float32Array;
    private _frameSize: number;
    private _buffer: Float32Array;
    private _frame: Float32Array;
    private _win: Float32Array;

    private _inputSize: number = 0;
    private _outputSize: number = 0;

    constructor(frameSize: number, hopA: number, hopS: number, winType: WindowType) {
        this._frameSize = frameSize;
        this._hopA = hopA;
        this._hopS = hopS;
        this._buffer = new Float32Array(this._frameSize);
        this._frame = new Float32Array(this._frameSize);
        this._win = new Float32Array(this._frameSize);
        generateWin(this._win, winType);
        this._inputQueue = new Float32Array(this._frameSize * 2);
        this._outputQueue = new Float32Array(this._frameSize * 2);
        this._out = new Float32Array();
    }

    process(inBuffer: Float32Array) {
        const inBufferLen = inBuffer.length;
        this._inputQueue.set(inBuffer, this._inputSize);
        this._inputSize += inBufferLen;

    }

    pop(output: Float32Array, bufferSize: number) {

    }

    dispose() {

    }

    protected _anslyse() {

    }

    protected _processing() {

    }

    protected _synthesis() {

    }

    protected _pushToOutputQueue(b: ArrayLike<number>) {
        this._outputQueue.set(b, this._outputQueue.length);
    }
}