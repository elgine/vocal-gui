import { cancel, take, call, fork } from 'redux-saga/effects';
import { EffectType } from '../../../processor/effectType';
import { createEffect, getAllDurationApplyEffect, getDelayApplyEffect, isEffectNeedBuffering, getDurationApplyEffect } from '../../../processor/effects/factory';
import { ACTION_PRERENDER } from './types';
import { SagaMiddleware } from 'redux-saga';
import { Action } from 'redux';

interface PrerenderAction extends Action<string>{
    payload: {
        source: AudioBuffer;
        effectType: EffectType;
        effectOptions: any;
    };
}

let offlineCtx: OfflineAudioContext;

function* clipDelay(buffer: AudioBuffer, delay: number) {
    const { sampleRate, numberOfChannels, duration } = buffer;
    let s = delay;
    let e = duration;
    let sb = s * sampleRate;
    let se = e * sampleRate;
    let final = yield call(offlineCtx.createBuffer, numberOfChannels, se - sb, sampleRate);
    for (let i = 0; i < buffer.numberOfChannels; i++) {
        const input: Float32Array = yield call(buffer.getChannelData, i);
        const clipped: Float32Array = yield call(input.subarray, sb, se);
        yield call(final.copyToChannel, clipped, i);
    }
    return final;
}

function* doPrerender({ payload }: PrerenderAction) {
    const { source, effectType, effectOptions } = payload;
    const { duration, sampleRate, numberOfChannels } = source;
    offlineCtx = new OfflineAudioContext({
        numberOfChannels,
        length: getAllDurationApplyEffect(effectType, effectOptions, duration) * sampleRate,
        sampleRate
    });
    let sourceNode = offlineCtx.createBufferSource();
    sourceNode.buffer = source;
    let effect = yield call(createEffect, effectType, offlineCtx, duration);
    yield call(effect.set, effectOptions);
    yield call(sourceNode.connect, effect!.input);
    yield call(effect.output.connect, offlineCtx.destination);
    yield call(sourceNode.start);

    let buffer = yield offlineCtx.startRendering();
    let delay = yield call(
        getDelayApplyEffect,
        effectType,
        effectOptions,
        duration
    );
    yield call(clipDelay, buffer, delay);
}

function* cancelPrerenderBgTask(task: any) {
    yield call(offlineCtx.suspend, 0);
    yield cancel(task);
}

function* prerenderSaga() {
    let lastTask: any;
    while (true) {
        const action = yield take(`editor/${ACTION_PRERENDER}`);
        if (lastTask) {
            yield cancelPrerenderBgTask(lastTask);
        }
        lastTask = yield fork(doPrerender, action);
    }
}

export default (saga: SagaMiddleware) => {
    saga.run(prerenderSaga);
};