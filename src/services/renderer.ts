import { createEffect, getAllDurationApplyEffect, getDelayApplyEffect } from '../processor/effects/factory';
import Effect from '../processor/effects/effect';
import { ID3WriterSupportFrames } from 'browser-id3-writer';

export type RenderTaskLevelNormal = 0;
export type RenderTaskLevelHigh = 1;
export type RenderTaskLevel = RenderTaskLevelNormal | RenderTaskLevelHigh;

export type RenderTaskStateWaiting = 0;
export type RenderTaskStateComplete = 1;
export type RenderTaskStateStopped = -2;
export type RenderTaskStateFailed = -1;
export type RenderTaskState = RenderTaskStateWaiting |
RenderTaskStateComplete |
RenderTaskStateStopped |
RenderTaskStateFailed;

export interface RenderTask{
    id: string;
    title: string;
    source: AudioBuffer;
    level: number;
    state: number;
    taskCreatedTime: number;
    effectType: number;
    effectOptions: any;
    clipRegion: number[];
    exportParams: ExportParams;
}

export default class Renderer {

    private _offlineAudioCtx!: OfflineAudioContext;
    private _effect!: Effect;
    private _rendering: boolean = false;

    * render(task: Pick<RenderTask, 'clipRegion' | 'source' | 'effectOptions' | 'effectType'>, onProcess?: (v: number) => void) {
        const { source, clipRegion, effectOptions, effectType } = task;
        if (!source) return;
        this._rendering = true;
        this._offlineAudioCtx = new OfflineAudioContext(
            source.numberOfChannels,
            getAllDurationApplyEffect(effectType, effectOptions, source.duration) * source!.sampleRate,
            source.sampleRate
        );

        if (!this._effect || this._effect.type !== task.effectType) {
            this._effect = yield createEffect(task.effectType, this._offlineAudioCtx);
        }
        this._effect.set(task.effectOptions);
        let input = this._offlineAudioCtx.createBufferSource();
        input.buffer = source;

        let progressProcessor = this._offlineAudioCtx.createScriptProcessor(1024);
        const onProgressProcess = () => {
            let processed = 0;
            const total = source.length;
            return (e: AudioProcessingEvent) => {
                processed += e.inputBuffer.length;
                onProcess && onProcess(processed / total);
            };
        };
        progressProcessor.onaudioprocess = onProgressProcess();
        input.connect(progressProcessor);

        progressProcessor.connect(this._effect.input);
        this._effect.output.connect(this._offlineAudioCtx.destination);
        input.start();

        let buffer: AudioBuffer = yield this._offlineAudioCtx.startRendering();
        // Clip region
        let delay = getDelayApplyEffect(effectType, effectOptions, buffer!.duration);
        let s = clipRegion[0] * 0.001 + delay;
        let e = clipRegion[1] * 0.001 + delay;
        let sb = s * buffer.sampleRate;
        let se = e * buffer.sampleRate;
        let final = this._offlineAudioCtx.createBuffer(
            buffer.numberOfChannels,
            (e - s) * buffer.sampleRate,
            buffer.sampleRate
        );
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            final.copyToChannel(buffer.getChannelData(i).subarray(sb, se), i);
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

    get rendering() {
        return this._rendering;
    }
}