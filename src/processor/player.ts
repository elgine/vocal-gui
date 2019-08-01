import Ticker from '../utils/ticker';
import Effect from './effects/effect';
import { EffectType } from './effectType';
import { createEffect, isEffectNeedBuffering, getAllDurationApplyEffect, getDelayApplyEffect, getDurationApplyEffect } from './effects/factory';
import { RematchDispatch } from '@rematch/core';
import { REDUCER_SET_PLAYER_BUFFERING, REDUCER_SET_PLAYING, REDUCER_SET_CURRENT_TIME } from '../store/models/editor/types';

export default class Player {

    private _dispatch: RematchDispatch;
    private _ticker: Ticker = new Ticker();
    // 播放器是否正在播放
    private _playing: boolean = false;
    // 播放器是否正在缓冲/预渲染
    private _buffering: boolean = false;
    // 真实的播放时间进度，以源数据时长作为参照
    private _actualTime: number = 0;
    // 中断时间戳，用于记录切换效果的当前时间
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
    private _needBuffering: boolean = false;
    private _volume: number = 1;
    private _clipRegion: number[] = [];

    constructor(dispatch: RematchDispatch<any>) {
        this._dispatch = dispatch;
        this._ticker.timeGetter = this._getTime.bind(this);
        this._ticker.onTick.on(this._onTick.bind(this));
    }

    setSource(s: AudioBuffer) {
        if (this._source === s) return;
        this._source = s;
        this.stop();
    }

    setClipRegion(v: number[]) {
        this._clipRegion = v;
    }

    async play() {
        if (this._playing) return;
        this._playing = true;
        this._clipRt();
        this._makesureInitialization();
        await this._updateEffect();
        this._updateInput();
        this._updateGraph();
        this._updateVolume();
        this._ticker.run();
    }

    async setEffect(e: EffectType, initialOptions?: any) {
        if (this._effectType === e) return;
        this._effectType = e;
        this._needBuffering = true;
        if (initialOptions) {
            this._effectOptions = initialOptions;
        }
        if (this._playing) {
            await this._restart();
        }
    }

    async setEffectOptions(options: any) {
        if (this._effectOptions === options) return;
        this._effectOptions = options;
        this._needBuffering = true;
        if (this._playing) {
            if (isEffectNeedBuffering(this._effectType)) {
                await this._restart();
            } else {
                this._updateEffectState();
            }
        }
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

    async seek(v: number) {
        if (this._actualTime === v) return;
        this._ticker.rt = this._actualTime = v;
        // 检查是否正在播放，中断停止并重新播放
        if (this._playing) {
            await this._restart();
        }
    }

    private async _restart() {
        this.stop();
        await this.play();
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

    /**
     * 对于某些具有改变时长以及动态延迟的效果，启用预渲染
     */
    private async _prerender() {
        this._buffering = true;
        this._dispatch.editor[REDUCER_SET_PLAYER_BUFFERING](true);
        const { duration, sampleRate, numberOfChannels } = this._source;
        let offlineCtx = new OfflineAudioContext({
            numberOfChannels,
            length: getAllDurationApplyEffect(this._effectType, this._effectOptions, duration) * sampleRate,
            sampleRate
        });
        let sourceNode = offlineCtx.createBufferSource();
        sourceNode.buffer = this._source;
        this._effect = createEffect(this._effectType, offlineCtx, duration);
        this._effect!.set(this._effectOptions);
        sourceNode.connect(this._effect!.input);
        this._effect!.output.connect(offlineCtx.destination);
        sourceNode.start();

        let buffer = await offlineCtx.startRendering();
        let delay = getDelayApplyEffect(
            this._effectType,
            this._effectOptions,
            duration
        );
        let s = delay;
        let e = buffer.duration;
        let sb = s * sampleRate;
        let se = e * sampleRate;
        this._prerenderSource = offlineCtx.createBuffer(
            buffer.numberOfChannels,
            se - sb,
            buffer.sampleRate
        );
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            this._prerenderSource.copyToChannel(buffer.getChannelData(i).subarray(sb, se), i);
        }
        this._buffering = false;
        this._dispatch.editor[REDUCER_SET_PLAYER_BUFFERING](false);
    }

    private async _updateEffect() {
        const effectNeedBuffering = isEffectNeedBuffering(this._effectType);
        if (!this._effect || this._effectType !== this._effect.type || (effectNeedBuffering && this._needBuffering)) {
            this._disposeEffect();
            if (effectNeedBuffering) {
                if (this._needBuffering) {
                    await this._prerender();
                }
            } else {
                this._prerenderSource = undefined;
                this._effect = createEffect(this._effectType, this._audioCtx);
            }
            this._needBuffering = false;
        }
        if (!effectNeedBuffering) {
            this._updateEffectState();
        }
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
                this._dispatch.editor[REDUCER_SET_PLAYING](false);
                return;
            }
        }
        this._dispatch.editor[REDUCER_SET_CURRENT_TIME](ct);
    }

    get playing() {
        return this._playing;
    }

    get buffering() {
        return this._buffering;
    }

    get currentTime() {
        return this._actualTime;
    }
}