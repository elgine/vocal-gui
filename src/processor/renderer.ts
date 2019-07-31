import { EffectType } from './effectType';
import { createEffect, getAllDurationApplyEffect, getDelayApplyEffect } from './effects/factory';
import Effect from './effects/effect';

export enum RenderTaskLevel{
    NORMAL,
    HIGH
}

export enum RenderTaskState{
    WAITING = 0,
    COMPLETE = 1,
    STOPPED = -2,
    FAILED = -1
}

export interface RenderTask{
    id: string;
    title: string;
    source?: AudioBuffer;
    level: RenderTaskLevel;
    state: RenderTaskState;
    taskCreatedTime: number;
    effectType: EffectType;
    effectOptions: any;
    clipRegion: number[];
    options: ExportParams;
}

export default class Renderer {

    private _offlineAudioCtx!: OfflineAudioContext;
    private _effect!: Effect;
    private _rendering: boolean = false;

    * render(task: RenderTask) {
        const { source, clipRegion, effectOptions, effectType } = task;
        this._rendering = true;
        this._offlineAudioCtx = new OfflineAudioContext(
            source!.numberOfChannels,
            1000 * getAllDurationApplyEffect(effectType, effectOptions, source!.duration),
            source!.sampleRate
        );
        yield this._buildGraph(task);
        let buffer: AudioBuffer = yield this._offlineAudioCtx.startRendering();
        // Clip region
        let delay = getDelayApplyEffect(effectType, effectOptions, source!.duration) * 1000;
        let s = clipRegion[0] + delay;
        let e = clipRegion[1] + delay;
        let sb = s * buffer.sampleRate;
        let se = e * buffer.sampleRate;
        let final = this._offlineAudioCtx.createBuffer(
            buffer.numberOfChannels,
            (e - s) * buffer.sampleRate,
            buffer.sampleRate
        );
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            let inChannel = buffer.getChannelData(i);
            let outChannel = final.getChannelData(i);
            for (let j = sb; j < se; j++) {
                outChannel[j] = inChannel[j];
            }
        }
        this._rendering = false;
        return final;
    }

    * stop() {
        yield this._offlineAudioCtx.suspend(this._offlineAudioCtx.currentTime);
        this._rendering = false;
    }

    * resume() {
        yield this._offlineAudioCtx.resume();
        this._rendering = true;
    }

    private* _buildGraph(task: RenderTask) {
        if (!task.source) return;
        if (!this._effect || this._effect.type !== task.effectType) {
            let e = yield createEffect(task.effectType, this._offlineAudioCtx);
            if (!e) {
                throw new Error(`No specific effect, ${task.effectType}`);
            }
            this._effect = e;
        }
        this._effect.set(task.effectOptions);
        let input = this._offlineAudioCtx.createBufferSource();
        input.buffer = task.source;
        input.connect(this._effect.input);
        this._effect.output.connect(this._offlineAudioCtx.destination);
    }

    get rendering() {
        return this._rendering;
    }
}