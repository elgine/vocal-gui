import Ticker from '../utils/ticker';
import Effect from './effects/effect';
import { EffectType } from './effectType';
import { getDelayApplyEffect, getDurationApplyEffect, createEffect } from './effects/factory';
import Emitter from '../utils/emitter';

export default class Player extends Emitter {

    static ON_BUFFERING = 'ON_BUFFERING';
    static ON_TICK = 'ON_TICK';
    static ON_ENDED = 'ON_ENDED';

    private _ticker: Ticker = new Ticker();
    // 真实的播放时间进度，以源数据时长作为参照
    private _actualTime: number = 0;
    // 中断时间戳，用于记录切换效果的当前时间
    // 继而判断是否到达延迟时间
    private _suspendTime: number = 0;
    // 播放器是否正在播放
    private _playing: boolean = false;
    // 播放器是否在缓冲/预渲染
    private _buffering: boolean = false;

    private _audioCtx!: AudioContext;
    private _effect: Effect|null = null;
    private _input: AudioBufferSourceNode|null = null;
    private _gain!: GainNode;

    private _source!: AudioBuffer;
    private _loop: boolean = false;
    private _effectType: EffectType = EffectType.NONE;
    private _effectOptions: any = {};
    private _volume: number = 1;
    private _clipRegion: number[] = [];

    constructor() {
        super();
        this._ticker.timeGetter = this._getTime.bind(this);
        this._ticker.onTick.on(this._onTick.bind(this));
    }

    setSource(s: AudioBuffer) {
        this._source = s;
        this.stop();
    }

    setClipRegion(v: number[]) {
        this._clipRegion = v;
    }

    play() {
        if (this._playing) return;
        this._playing = true;
        if (this._actualTime < this._clipRegion[0]) {
            this._actualTime = this._clipRegion[0];
        } else if (this._actualTime > this._clipRegion[1]) {
            this._actualTime = this._clipRegion[1];
        }
        this._makesureInitialization();
        this._updateInput();
        this._updateEffect();
        this._updateGraph();
        this._updateOptions();
        this._input!.start(0, this._actualTime * 0.001);
        this._ticker.run();
    }

    setEffect(e: EffectType, initialOptions?: any) {
        if (this._effectType === e) return;
        this._effectType = e;
        initialOptions && this.setEffectOptions(initialOptions);
        if (this._playing) {
            this._restart();
        }
    }

    setEffectOptions(options: any) {
        this._effectOptions = options;
        this._updateOptions();
    }

    setVolume(v: number) {
        if (this._volume === v) return;
        this._volume = v;
        this._updateOptions();
    }

    stop() {
        if (!this._playing) return;
        this._playing = false;
        this._interrupt();
        this._disposeInput();
        this._disposeEffect();
        this._ticker.stop();
    }

    setRepeat(v: boolean) {
        this._loop = v;
    }

    seek(v: number) {
        if (this._actualTime === v) return;
        this._actualTime = v;
        // 检查是否正在播放，中断停止并重新播放
        if (this._playing) {
            this._restart();
        }
    }

    private _restart() {
        this.stop();
        this.play();
    }

    private _makesureInitialization() {
        if (!this._audioCtx) {
            this._audioCtx = new AudioContext();
        }
        if (!this._gain) {
            this._gain = this._audioCtx.createGain();
            this._gain.connect(this._audioCtx.destination);
        }
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
        this._input.buffer = this._source;
    }

    private _disposeEffect() {
        if (this._effect) {
            this._effect.dispose();
            this._effect.output.disconnect();
        }
    }

    private _updateEffect() {
        this._disposeEffect();
        this._effect = createEffect(this._effectType, this._audioCtx);
    }

    private _updateOptions() {
        if (this._effect) {
            this._effect.set(this._effectOptions);
        }
        if (this._gain) {
            this._gain.gain.value = this._volume;
        }
    }

    private _updateGraph() {
        if (!this._input) return;
        if (this._effect) {
            this._effect.setSourceDuration(this._source.duration);
            this._input.connect(this._effect.input);
            this._effect.output.connect(this._gain);
        } else {
            this._input.connect(this._gain);
        }
    }

    /**
     * 要是处于中断状态，effect 需要清除已有的缓存
     */
    private _interrupt() {
        this._suspendTime = this._ticker.rt = this._actualTime;
    }

    private _calcActualTime() {
        // 相对差值
        const ct = this._ticker.rt;
        const diff = ct - this._suspendTime;
        const duration = this._source.duration;
        console.log(this._effectOptions);
        const delay = getDelayApplyEffect(this._effectType, this._effectOptions, duration) * 1000;
        const timeScale = getDurationApplyEffect(this._effectType, this._effectOptions, duration) / duration;
        // 判断是否小于延迟时间，若小于，不做处理
        if (diff < delay) {
            if (!this._buffering) {
                this._buffering = true;
                this.emit(Player.ON_BUFFERING, true);
            }
            return;
        }
        // 若到达或超过延迟时间，则计算出真实时间
        else {
            if (this._buffering) {
                this._buffering = false;
                this.emit(Player.ON_BUFFERING, false);
            }
            this._actualTime = (diff - delay) / timeScale + this._suspendTime;
            console.log(diff, delay, timeScale);
        }
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
                this.emit(Player.ON_ENDED, ct);
                return;
            }
        }
        this.emit(Player.ON_TICK, ct);
    }
}