import Signal from './signal';

// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const requestAnimationFrame = (function() {
    if (window) {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                function(callback: Function) {
                    return window.setTimeout(callback, 1000 / 60);
                };
    } else { return function(callback: Function) {
        return setTimeout(callback, 1000 / 60);
    }; }
})();

const cancelAnimationFrame = (function() {
    if (window) {
        return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
    } else {
        return clearTimeout;
    }
})();

/**
 * Simple ticker
 * @class Ticker
 */
export default class Ticker {

    timeGetter?: () => number;

    onTick: Signal = new Signal();

    /**
     * Tick fps
     * @type {number}
     */
    protected _fps: number = 60;

    protected _intervalPerSec: number = 1000 / 60;

    // In order to prevent the situation that requestAnimationFrame
    // will be suspensed when browser window is inactive, so capture
    // both requestAnimationFrame and setTimeout to make sure ticking
    // and remove ticker ortimer when another is reached.
    // RequestAnimationFrame ticker id
    protected _tickerId: number = -1;
    // SetTimeout timer id
    protected _timerId: number = -1;

    /**
     * Time-stamp from start time-stamp
     * @type {Number}
     * @protected
     */
    protected _rt: number;

    /**
     * Start time-stamp
     * @type {Number}
     * @protected
     */
    protected _st: number;

    /**
     * Last time-stamp
     * @type {Number}
     * @protected
     */
    protected _lt: number;

    /**
     * Delta time-stamp
     * @type {Number}
     * @protected
     */
    protected _dt: number;

    /**
     * Current time-stamp
     * @type {Number}
     * @protected
     */
    protected _ct: number;

    protected _tt: number;
    protected _isRunning: boolean;

    constructor() {
        this.fps = 60;
        this._rt = 0;
        this._st = -1;
        this._lt = 0;
        this._dt = 0;
        this._ct = 0;
        this._tt = 0;
        this._isRunning = false;
        this._run = this._run.bind(this);
    }

    reset() {
        this._st = -1;
    }

    run() {
        if (this._isRunning) return;
        this._isRunning = true;
        if (!this._st) {
            this._st = this._getTime();
        }
        this._lt = this._getTime();
        this._run();
    }

    _run() {
        this._ct = this._getTime();
        this._dt = this._ct - this._lt;
        this._rt += this._dt;
        this._lt = this._ct;
        this._tt += this._dt;
        if (this._tt > this._intervalPerSec) {
            if (this._isRunning) {
                this.onTick.emit(this);
            }
            this._tt -= this._intervalPerSec;
        }
        if (this._isRunning) {
            this._tick();
        }
    }

    stop() {
        this._isRunning = false;
        this._cancelTick();
    }

    protected _getTime() {
        return this.timeGetter ? this.timeGetter() : Date.now();
    }

    protected _tick() {
        this._tickerId = requestAnimationFrame(() => {
            clearTimeout(this._timerId);
            this._run();
        });
        this._timerId = window.setTimeout(() => {
            cancelAnimationFrame(this._tickerId);
            this._run();
        }, 1000 / 60);
    }

    protected _cancelTick() {
        cancelAnimationFrame(this._tickerId);
        clearTimeout(this._timerId);
    }

    get isRunning() {
        return this._isRunning;
    }

    get fps(): number {
        return this._fps;
    }

    set fps(v: number) {
        if (this._fps !== v) {
            this._fps = v;
            this._intervalPerSec = 1 / this._fps;
        }
    }

    set rt(v: number) {
        this._rt = v;
    }

    get rt(): number {
        return this._rt;
    }

    get ct(): number {
        return this._ct;
    }

    get dt(): number {
        return this._dt;
    }

    get st(): number {
        return this._st;
    }
}