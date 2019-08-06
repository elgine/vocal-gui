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
    source?: AudioBuffer;
    level: number;
    state: number;
    taskCreatedTime: number;
    effectType: number;
    effectOptions: any;
    clipRegion: number[];
    exportParams: ExportParams;
}

export default class Renderer {

    private _rendering: boolean = false;
    private _offlineAudioCtx!: OfflineAudioContext;

    * render(task: Pick<RenderTask, 'clipRegion' | 'source' | 'effectOptions' | 'effectType'>, onProcess?: (v: number) => void) {
        const { source, clipRegion, effectOptions, effectType } = task;
        if (!source) return;
        this._rendering = true;
        const { duration, sampleRate, numberOfChannels } = source;
        let offlineCtx = this._offlineAudioCtx = new OfflineAudioContext({
            numberOfChannels,
            length: getAllDurationApplyEffect(effectType, effectOptions, duration) * sampleRate,
            sampleRate
        });

        // Build graph
        let sourceNode = offlineCtx.createBufferSource();
        sourceNode.buffer = source;

        let progressProcessor = this._offlineAudioCtx.createScriptProcessor(1024);
        let processed = 0;
        const total = source.length;
        progressProcessor.onaudioprocess = (e: AudioProcessingEvent) => {
            processed += e.inputBuffer.length;
            onProcess && onProcess(Math.round((processed / total * 100)) * 0.01);
            for (let i = 0; i < e.inputBuffer.numberOfChannels; i++) {
                e.outputBuffer.copyToChannel(e.inputBuffer.getChannelData(i), i);
            }
        };

        let effect = createEffect(effectType, offlineCtx, duration);
        effect!.set(effectOptions);

        sourceNode.connect(progressProcessor);
        progressProcessor.connect(effect!.input);

        effect!.output.connect(offlineCtx.destination);
        sourceNode.start();

        let buffer = yield offlineCtx.startRendering();

        // Release graph
        sourceNode.stop();
        sourceNode.disconnect();
        effect!.output.disconnect();

        let delay = getDelayApplyEffect(
            effectType,
            effectOptions,
            duration
        );

        let s = clipRegion[0] * 0.001 + delay;
        let e = clipRegion[1] * 0.001 + delay;
        let sb = s * buffer.sampleRate;
        let se = e * buffer.sampleRate;
        let final = offlineCtx.createBuffer(numberOfChannels, se - sb, buffer.sampleRate);
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