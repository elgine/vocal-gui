import { EffectType } from '../../../processor/effectType';

export const REDUCER_SET_ZOOM = 'REDUCER_SET_ZOOM';
export const REDUCER_SET_DURATION = 'REDUCER_SET_DURATION';
export const REDUCER_SET_CURRENT_TIME = 'REDUCER_SET_CURRENT_TIME';
export const REDUCER_SET_CLIP_REGION = 'REDUCER_SET_CLIP_REGION';
export const REDUCER_SET_EFFECT = 'REDUCER_SET_EFFECT';
export const REDUCER_SET_EFFECT_OPTIONS = 'REDUCER_SET_EFFECT_OPTIONS';
export const REDUCER_SET_PLAYING = 'REDUCER_SET_PLAYING';
export const REDUCER_SET_PLAYER_BUFFERING = 'REDUCER_SET_PLAYER_BUFFERING';
export const REDUCER_SET_VOLUME = 'REDUCER_SET_VOLUME';
export const REDUCER_SET_REPEAT = 'REDUCER_SET_REPEAT';
export const REDUCER_SET_TITLE = 'REDUCER_SET_TITLE';
export const REDUCER_SET_LOADING = 'REDUCER_SET_LOADING';
export const REDUCER_SET_BUFFER = 'REDUCER_SET_BUFFER';
export const REDUCER_SET_INITIALIZING = 'REDUCER_SET_INITIALIZING';

export const ACTION_LOAD_SOURCE = 'ACTION_LOAD_SOURCE';
export const ACTION_LOAD_SOURCE_SUCCESS = 'ACTION_LOAD_SOURCE_SUCCESS';
export const ACTION_LOAD_FAILED = 'ACTION_LOAD_FAILED';
export const ACTION_LOAD_FROM_EXTERNAL = 'ACTION_LOAD_FROM_EXTERNAL';
export const ACTION_CANCEL_LOAD_SORUCE = 'ACTION_CANCEL_LOAD_SORUCE';
export const ACTION_LOAD_FROM_MIC = 'ACTION_LOAD_FROM_MIC';

export const ACTION_SWITCH_REPEAT = 'ACTION_SWITCH_REPEAT';
export const ACTION_SWITCH_PLAYING = 'ACTION_SWITCH_PLAYING';
export const ACTION_PLAY = 'ACTION_PLAY';
export const ACTION_STOP = 'ACTION_STOP';
export const ACTION_SET_VOLUME = 'ACTION_SET_VOLUME';
export const ACTION_START_PLAYING = 'ACTION_START_PLAYING';
export const ACTION_STOP_PLAYING = 'ACTION_STOP_PLAYING';

export const ACTION_INITIALIZE = 'ACTION_INITIALIZE';

export const ACTION_SWITCH_EFFECT = 'ACTION_SWITCH_EFFECT';
export const ACTION_EFFECT_OPTIONS_CHANGE = 'ACTION_EFFECT_OPTIONS_CHANGE';

export const ACTION_ZOOM = 'ACTION_ZOOM';
export const ACTION_ZOOM_IN = 'ACTION_ZOOM_IN';
export const ACTION_ZOOM_OUT = 'ACTION_ZOOM_OUT';
export const ACTION_CLIP_REGION_CHANGE = 'ACTION_CLIP_REGION_CHANGE';
export const ACTION_SKIP_PREVIOUS = 'ACTION_SKIP_PREVIOUS';
export const ACTION_SEEK = 'ACTION_SEEK';
export const ACTION_SKIP_NEXT = 'ACTION_SKIP_NEXT';

export interface EditorState{
    title: string;
    audioBuffer?: AudioBuffer;
    initializing: boolean;
    loading: boolean;
    playing: boolean;
    buffering: boolean;
    repeat: boolean;
    volume: number;
    effect: EffectType;
    effectOptions: any;
    pixelsPerMSec: number;
    baseTimeUnit: number;
    timeUnits: number[];
    duration: number;
    currentTime: number;
    clipRegion: number[];
    zoom: number;
    zoomUnit: {
        in: number;
        out: number;
    };
}