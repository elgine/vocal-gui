import Ticker from '../utils/ticker';
import Effect from '../processor/effects/effect';
import { EffectType } from '../processor/effectType';
import { createEffect, getDurationApplyEffect } from '../processor/effects/factory';
import { REDUCER_SET_PLAYING, REDUCER_SET_CURRENT_TIME, ACTION_PRERENDER, ACTION_STOP_PLAYING, REDUCER_SET_BUFFER } from '../store/models/editor/types';
import { Dispatch } from 'redux';

export default class Player {

    private _dispatch: Dispatch;
    private _ticker: Ticker = new Ticker();
    // whether is playing
    private _playing: boolean = false;
    // Actual play time in source duration unit
    private _actualTime: number = 0;
    // Suspend time
    private _suspendTime: number = 0;

    private _audioCtx!: AudioContext;
    private _effect: Effect|null = null;
    private _input: AudioBufferSourceNode|null = null;
    private _gain!: GainNode;

    private _source!: AudioBuffer;
    private _prerenderSource?: AudioBuffer;
    private _loop: boolean = false;
    private _effectType: EffectType = EffectType.NONE;
    private _effectOptions: any = {};
    private _volume: number = 1;
    private _clipRegion: number[] = [];

    constructor(dispatch: Dispatch) {
        this._dispatch = dispatch;
        this._ticker.timeGetter = this._getTime.bind(this);
        this._ticker.onTick.on(this._onTick.bind(this));
    }

    setPrerenderBuffer(v?: AudioBuffer) {
        this._prerenderSource = v;
    }

    setSource(s: AudioBuffer) {
        if (this._source === s) return;
        this._source = s;
    }

    setClipRegion(v: number[]) {
        this._clipRegion = v;
    }

    play() {
        if (this._playing) return;
        this._playing = true;
        this._clipRt();
        this._initialize();
        this._updateEffect();
        this._updateInput();
        this._updateGraph();
        this._updateVolume();
        this._updateEffectState();
        this._ticker.run();
    }

    setEffect(e: EffectType, initialOptions?: any) {
        if (this._effectType === e) return;
        this._effectType = e;
        if (initialOptions) {
            this._effectOptions = initialOptions;
        }
    }

    setEffectOptions(options: any) {
        if (this._effectOptions === options) return;
        this._effectOptions = options;
    }

    setVolume(v: number) {
        if (this._volume === v) return;
        this._volume = v;
        this._updateVolume();
    }

    stop() {
        if (!this._playing) return;
        this._playing = false;
        this._interrupt();
        this._disposeInput();
        this._ticker.stop();
    }

    setRepeat(v: boolean) {
        this._loop = v;
    }

    seek(v: number) {
        if (this._actualTime === v) return;
        this._ticker.rt = this._actualTime = v;
        if (this._playing) {
            return this._restart();
        }
        return false;
    }

    private _initialize() {
        if (!this._audioCtx) {
            this._audioCtx = new AudioContext();
        }
        if (!this._gain) {
            this._gain = this._audioCtx.createGain();
            this._gain.connect(this._audioCtx.destination);
        }
    }

    private _updateEffect() {
        if (!this._effect || this._effectType !== this._effect.type) {
            this._disposeEffect();
            if (!this._prerenderSource) {
                this._effect = createEffect(this._effectType, this._audioCtx);
            }
        }
    }

    private _restart() {
        this.stop();
        this.play();
    }

    private _disposeInput() {
        if (this._input) {
            this._input.stop();
            this._input.disconnect();
            this._input.onended = null;
            this._input = null;
        }
    }

    private _updateInput() {
        this._disposeInput();
        this._input = this._audioCtx.createBufferSource();
        this._input.buffer = this._prerenderSource || this._source;
        this._input!.start(0, this._actualTime * this._getTimeScale() * 0.001);
    }

    private _disposeEffect() {
        if (this._effect) {
            this._effect.dispose();
            this._effect.output.disconnect();
        }
    }

    private _getTimeScale() {
        return getDurationApplyEffect(this._effectType, this._effectOptions, this._source.duration) / this._source.duration;
    }

    private _updateEffectState() {
        if (this._effect) {
            this._effect.set(this._effectOptions);
        }
    }

    private _updateVolume() {
        if (this._gain) {
            this._gain.gain.value = this._volume;
        }
    }

    private _updateGraph() {
        if (!this._input) return;
        if (this._effect && !this._prerenderSource) {
            this._input.connect(this._effect.input);
            this._effect.output.connect(this._gain);
        } else {
            this._input.connect(this._gain);
        }
    }

    private _clipRt() {
        if (this._ticker.rt < this._clipRegion[0]) {
            this._ticker.rt = this._clipRegion[0];
        } else if (this._ticker.rt > this._clipRegion[1]) {
            this._ticker.rt = this._clipRegion[1];
        }
    }

    private _calcActualTime() {
        const ct = this._ticker.rt;
        const timeScale = this._getTimeScale();
        this._actualTime = (ct - this._suspendTime) / timeScale + this._suspendTime;
    }

    /**
     * 要是处于中断状态，effect 需要清除已有的缓存
     */
    private _interrupt() {
        this._suspendTime = this._ticker.rt = this._actualTime;
    }

    /**
     * 获取基于 AudioContext 时间基的相对时间
     * @return [number]
     */
    private _getTime() {
        return Math.max(0, (this._audioCtx.currentTime - this._audioCtx.baseLatency)) * 1000;
    }

    private _onTick() {
        if (!this._playing) return;
        this._calcActualTime();
        const ct = this._actualTime;
        const s = this._clipRegion[0];
        const e = this._clipRegion[1];
        if (ct <= s) {
            this.seek(s);
        } else if (ct >= e) {
            if (this._loop) {
                this.seek(s);
            } else {
                this.stop();
                this.seek(e);
                this._dispatch({
                    type: `editor/${REDUCER_SET_PLAYING}`,
                    payload: false
                });
                return;
            }
        }
        this._dispatch({
            type: `editor/${REDUCER_SET_CURRENT_TIME}`,
            payload: ct
        });
    }

    get playing() {
        return this._playing;
    }

    get currentTime() {
        return this._actualTime;
    }
}