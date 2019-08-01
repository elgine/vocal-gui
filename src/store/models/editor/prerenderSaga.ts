import { cancel, take, call, fork, put, race } from 'redux-saga/effects';
import { EffectType } from '../../../processor/effectType';
import { createEffect, getAllDurationApplyEffect, getDelayApplyEffect } from '../../../processor/effects/factory';
import { SagaMiddleware } from 'redux-saga';
import { Action } from 'redux';
import { ACTION_PRERENDER_SUCCESS, ACTION_PRERENDER, ACTION_CANCEL_PRERENDER } from './types';

interface PrerenderAction extends Action<string>{
    payload: {
        source: AudioBuffer;
        effectType: EffectType;
        effectOptions: any;
    };
}

let offlineCtx: OfflineAudioContext;

function* doPrerender({ payload }: PrerenderAction) {
    const { source, effectType, effectOptions } = payload;
    const { duration, sampleRate, numberOfChannels } = source;
    offlineCtx = new OfflineAudioContext({
        numberOfChannels,
        length: getAllDurationApplyEffect(effectType, effectOptions, duration) * sampleRate,
        sampleRate
    });

    // Build graph
    let sourceNode = offlineCtx.createBufferSource();
    sourceNode.buffer = source;
    let effect = yield call(createEffect, effectType, offlineCtx, duration);
    effect!.set(effectOptions);
    sourceNode.connect(effect!.input);
    effect!.output.connect(offlineCtx.destination);
    sourceNode.start();

    let buffer = yield offlineCtx.startRendering();

    // Release graph
    sourceNode.stop();
    sourceNode.disconnect();
    effect!.output.disconnect();

    let delay = yield call(
        getDelayApplyEffect,
        effectType,
        effectOptions,
        duration
    );
    let s = delay;
    let e = buffer.duration;
    let sb = s * buffer.sampleRate;
    let se = e * buffer.sampleRate;
    let final = offlineCtx.createBuffer(numberOfChannels, se - sb, buffer.sampleRate);
    for (let i = 0; i < buffer.numberOfChannels; i++) {
        final.copyToChannel(buffer.getChannelData(i).subarray(sb, se), i);
    }
    yield put({ type: `editor/${ACTION_PRERENDER_SUCCESS}`, payload: final });
}

function* prerenderSaga() {
    let lastTask: any;
    while (true) {
        const { prerender } = yield race({
            prerender: take(`editor/${ACTION_PRERENDER}`),
            cancelPrerender: take(`editor/${ACTION_CANCEL_PRERENDER}`)
        });
        if (lastTask) {
            yield cancel(lastTask);
        }
        if (prerender) {
            lastTask = yield fork(doPrerender, prerender);
        }
    }
}

export default (saga: SagaMiddleware) => {
    saga.run(prerenderSaga);
};