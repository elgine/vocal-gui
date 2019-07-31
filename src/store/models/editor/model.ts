import { RematchDispatch, ModelConfig } from '@rematch/core';
import { clamp } from 'lodash';
import { batch } from 'react-redux';
import {
    EditorState,
    ACTION_ZOOM,
    ACTION_CLIP_REGION_CHANGE,
    REDUCER_SET_DURATION,
    REDUCER_SET_ZOOM,
    REDUCER_SET_CLIP_REGION,
    ACTION_ZOOM_IN,
    ACTION_ZOOM_OUT,
    REDUCER_SET_CURRENT_TIME,
    ACTION_SEEK,
    ACTION_SKIP_PREVIOUS,
    ACTION_SKIP_NEXT,
    ACTION_LOAD_SOURCE,
    ACTION_LOAD_SOURCE_SUCCESS,
    ACTION_CANCEL_LOAD_SORUCE,
    REDUCER_SET_TITLE,
    ACTION_LOAD_FROM_EXTERNAL,
    REDUCER_SET_LOADING,
    REDUCER_SET_BUFFER,
    ACTION_LOAD_FAILED,
    REDUCER_SET_EFFECT_OPTIONS,
    ACTION_SWITCH_EFFECT,
    REDUCER_SET_EFFECT,
    ACTION_EFFECT_OPTIONS_CHANGE,
    REDUCER_SET_VOLUME,
    REDUCER_SET_PLAYING,
    REDUCER_SET_REPEAT,
    ACTION_SWITCH_PLAYING,
    ACTION_PLAY,
    ACTION_STOP,
    ACTION_SWITCH_REPEAT,
    ACTION_SET_VOLUME,
    REDUCER_SET_PLAYER_BUFFERING
} from './types';
import { TIME_UNITS, PIXELS_PER_TIME_UNIT, ZOOM_MAXIMUM, ZOOM_MINIMUM, UNDEFINED_STRING } from '../../../constant';
import { getPlayer } from '../../../processor';
import { RootState } from '../../index';
import { EffectType } from '../../../processor/effectType';
import { getEffectOptions } from '../../../processor/effects/factory';
import { ACTION_SHOW_MESSAGE } from '../message/type';
import Player from '../../../processor/player2';

const player = getPlayer();

const initialState: EditorState = {
    title: UNDEFINED_STRING,
    effect: EffectType.NONE,
    effectOptions: getEffectOptions(EffectType.NONE),
    repeat: false,
    playing: false,
    loading: false,
    buffering: false,
    volume: 1,
    pixelsPerMSec: 0.01,
    duration: 0,
    zoom: 1,
    zoomUnit: {
        in: 2,
        out: 0.5
    },
    baseTimeUnit: TIME_UNITS[0],
    timeUnits: TIME_UNITS,
    currentTime: 0,
    clipRegion: [0, 0]
};

const roundTimeUnit = (timeUnit: number) => {
    const unitStr = String(timeUnit);
    const len = unitStr.length;
    const den = Math.pow(10, len - 1);
    return Math.ceil(timeUnit / den) * den;
};

const calcProperTimeUnit = (duration: number) => {
    return roundTimeUnit(~~(duration * 0.05));
};

const calcProperTimeUnits = (timeUnit: number) => {
    return [
        timeUnit,
        timeUnit * 0.5,
        timeUnit * 0.25
    ];
};

const updateTimeUnits = (state: EditorState) => {
    let zoom = 1;
    if (state.zoom > 1) {
        zoom = (state.zoom - 1) * state.zoomUnit.in + 1;
    } else if (state.zoom < 1) {
        zoom = 1 / (((1 - state.zoom) * state.zoomUnit.out) + 1);
    }
    let ideaTimeUnit = Math.ceil(state.baseTimeUnit * (zoom || 1));
    state.timeUnits = calcProperTimeUnits(ideaTimeUnit);
    state.pixelsPerMSec = PIXELS_PER_TIME_UNIT / state.timeUnits[0];
};

const timelineModel: ModelConfig<EditorState> = {
    state: initialState,
    reducers: {
        [REDUCER_SET_PLAYER_BUFFERING](state: EditorState, payload: boolean) {
            state.buffering = payload;
            return state;
        },
        [REDUCER_SET_REPEAT](state: EditorState, payload: boolean) {
            state.repeat = payload;
            return state;
        },
        [REDUCER_SET_PLAYING](state: EditorState, payload: boolean) {
            state.playing = payload;
            return state;
        },
        [REDUCER_SET_VOLUME](state: EditorState, payload: number) {
            state.volume = payload;
            return state;
        },
        [REDUCER_SET_EFFECT](state: EditorState, payload: EffectType) {
            state.effect = payload;
            return state;
        },
        [REDUCER_SET_EFFECT_OPTIONS](state: EditorState, payload: any) {
            /* eslint-disable */
            for (let k in payload) {
                state.effectOptions[k] = payload[k];
            }
            return state;
        },
        [REDUCER_SET_ZOOM](state: EditorState, payload: number) {
            state.zoom = payload;
            updateTimeUnits(state);
            return state;
        },
        [REDUCER_SET_CURRENT_TIME](state: EditorState, payload: number) {
            state.currentTime = clamp(payload, state.clipRegion[0], state.clipRegion[1]);
            return state;
        },
        [REDUCER_SET_DURATION](state: EditorState, payload: number) {
            state.duration = payload;
            state.baseTimeUnit = calcProperTimeUnit(state.duration);
            state.zoomUnit.out = Math.max(2, Math.ceil(1000 / state.baseTimeUnit));
            state.zoomUnit.in = Math.max(2, Math.ceil((state.duration * 0.01) / state.baseTimeUnit));
            updateTimeUnits(state);
            return state;
        },
        [REDUCER_SET_CLIP_REGION](state: EditorState, payload: number[]) {
            state.clipRegion = payload;
            return state;
        },
        [REDUCER_SET_LOADING](state: EditorState, payload: boolean) {
            state.loading = payload;
            return state;
        },
        [REDUCER_SET_TITLE](state: EditorState, payload: string) {
            state.title = payload;
            return state;
        },
        [REDUCER_SET_BUFFER](state: EditorState, payload: AudioBuffer) {
            state.audioBuffer = payload;
            return state;
        }
    },
    effects: (dispatch: RematchDispatch<any>) => {
        player.on(Player.ON_TICK, dispatch.editor[REDUCER_SET_CURRENT_TIME]);
        player.on(Player.ON_ENDED, () => dispatch.editor[REDUCER_SET_PLAYING](false));
        player.on(Player.ON_BUFFERING, dispatch.editor[REDUCER_SET_PLAYER_BUFFERING]);
        return {
            async [ACTION_SWITCH_EFFECT](payload: EffectType) {
                const options = getEffectOptions(payload);
                await player.setEffect(payload);
                player.setEffectOptions(options);
                batch(() => {
                    dispatch.editor[REDUCER_SET_EFFECT](payload);
                    dispatch.editor[REDUCER_SET_EFFECT_OPTIONS](options);     
                });
            },
            [ACTION_EFFECT_OPTIONS_CHANGE](payload: any, {present}: RootState) {
                dispatch.editor[REDUCER_SET_EFFECT_OPTIONS](payload);
                player.setEffectOptions({
                    ...present.editor.effectOptions,
                    ...payload
                });
            },
            [ACTION_SWITCH_PLAYING](payload: any, { present }: RootState) {
                if (!present.editor.playing) {
                    dispatch.editor[ACTION_PLAY]();
                } else {
                    dispatch.editor[ACTION_STOP]();
                }
            },
            [ACTION_SWITCH_REPEAT](payload: any, { present }: RootState) {
                let r = !present.editor.repeat;
                player.setRepeat(r);
                dispatch.editor[REDUCER_SET_REPEAT](r);
            },
            async [ACTION_PLAY](payload: any, { present }: RootState) {
                if (!present.editor.audioBuffer) return;
                await player.play();
                dispatch.editor[REDUCER_SET_PLAYING](true);
            },
            [ACTION_STOP](payload: any, { present }: RootState) {
                if (!present.editor.audioBuffer) return;
                player.stop();
                dispatch.editor[REDUCER_SET_PLAYING](false);
            },
            [ACTION_SET_VOLUME](payload: number) {
                player.setVolume(payload);
                dispatch.editor[REDUCER_SET_VOLUME](clamp(payload, 0, 1));
            },
            [ACTION_CANCEL_LOAD_SORUCE]() {
                dispatch.editor[REDUCER_SET_LOADING](false);
            },
            [ACTION_LOAD_SOURCE](payload: {type: SourceType; value?: string | File | AudioBuffer}) {
                if (!payload.value) return;
                if (payload.type === 'MIC') {
                    dispatch.editor[ACTION_LOAD_SOURCE_SUCCESS]({
                        title: `Record${Date.now()}`,
                        buffer: payload.value as AudioBuffer
                    });
                } else {
                    dispatch.editor[ACTION_LOAD_FROM_EXTERNAL](payload.value);
                }
            },
            [ACTION_LOAD_SOURCE_SUCCESS]({ buffer, title }: {buffer: AudioBuffer; title: string}) {
                batch(() => {
                    player.setSource(buffer);
                    dispatch.editor[REDUCER_SET_TITLE](title);
                    dispatch.editor[REDUCER_SET_BUFFER](buffer);
                    dispatch.editor[REDUCER_SET_LOADING](false);
                    dispatch.editor[REDUCER_SET_DURATION](buffer.duration * 1000);
                    dispatch.editor[ACTION_CLIP_REGION_CHANGE]([
                        0,
                        buffer.duration * 1000
                    ]);
                });
            },
            [ACTION_LOAD_FROM_EXTERNAL](payload: string) {
                dispatch.editor[REDUCER_SET_LOADING](true);
            },
            [ACTION_LOAD_FAILED](payload: Error) {
                batch(() => {
                    dispatch.editor[REDUCER_SET_LOADING](false);
                    dispatch.message[ACTION_SHOW_MESSAGE]({
                        msg: payload.message,
                        msgType: 'ERROR'
                    });
                });
            },
            [ACTION_ZOOM](payload: number) {
                dispatch.editor[REDUCER_SET_ZOOM](payload);
            },
            [ACTION_ZOOM_IN](payload: any, { present }: RootState) {
                dispatch.editor[ACTION_ZOOM](clamp(present.editor.zoom - (ZOOM_MAXIMUM - ZOOM_MINIMUM) * 0.1, ZOOM_MINIMUM, ZOOM_MAXIMUM));
            },
            [ACTION_ZOOM_OUT](payload: any, { present }: RootState) {
                dispatch.editor[ACTION_ZOOM](clamp(present.editor.zoom + (ZOOM_MAXIMUM - ZOOM_MINIMUM) * 0.1, ZOOM_MINIMUM, ZOOM_MAXIMUM));
            },
            async [ACTION_SEEK](payload: number) {
                await player.seek(payload);
                dispatch.editor[REDUCER_SET_CURRENT_TIME](payload);
            },
            [ACTION_SKIP_PREVIOUS](payload: any, { present }: RootState) {
                dispatch.editor[ACTION_SEEK](present.editor.clipRegion[0]);
            },
            [ACTION_SKIP_NEXT](payload: any, { present }: RootState) {
                dispatch.editor[ACTION_SEEK](present.editor.clipRegion[1]);
            },
            [ACTION_CLIP_REGION_CHANGE](payload: number[], { present }: RootState) {
                const timeline = present.editor;
                if (payload[1] < payload[0]) {
                    let temp = payload[0];
                    payload[0] = payload[1];
                    payload[1] = temp;
                }
                payload[0] = clamp(payload[0], 0, timeline.duration);
                payload[1] = clamp(payload[1], 0, timeline.duration);
                player.setClipRegion(payload);
                dispatch.editor[REDUCER_SET_CLIP_REGION](payload);
            }
        };
    }
};

export default timelineModel;