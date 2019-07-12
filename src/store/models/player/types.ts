import { EffectType } from '../../../processor/effectType';

export const REDUCER_SET_PLAYING = 'REDUCER_SET_PLAYING';
export const REDUCER_SET_CURRENT_TIME = 'REDUCER_SET_CURRENT_TIME';
export const REDUCER_SET_VOLUME = 'REDUCER_SET_VOLUME';
export const REDUCER_SET_PLAYBACK_SPEED = 'REDUCER_SET_PLAYBACK_SPEED';
export const REDUCER_SET_EFFECT = 'REDUCER_SET_EFFECT';
export const REDUCER_SET_EFFECT_OPTIONS = 'REDUCER_SET_EFFECT_OPTIONS';
export const REDUCER_SET_REPEAT = 'REDUCER_SET_REPEAT';

export const ACTION_SWITCH_REPEAT = 'ACTION_SWITCH_REPEAT';
export const ACTION_SWITCH_PLAYING = 'ACTION_SWITCH_PLAYING';
export const ACTION_PLAY = 'ACTION_PLAY';
export const ACTION_STOP = 'ACTION_STOP';
export const ACTION_SEEK = 'ACTION_SEEK';
export const ACTION_SET_VOLUME = 'ACTION_SET_VOLUME';
export const ACTION_START_PLAYING = 'ACTION_START_PLAYING';
export const ACTION_START_PLAYING_ASYNC = 'ACTION_START_PLAYING_ASYNC';
export const ACTION_STOP_PLAYING = 'ACTION_STOP_PLAYING';
export const ACTION_SET_PLAYBACK_SPEED = 'ACTION_SET_PLAYBACK_SPEED';
export const ACTION_SET_EFFECT = 'ACTION_SET_EFFECT';
export const ACTION_SET_EFFECT_OPTIONS = 'ACTION_SET_EFFECT_OPTIONS';

export interface PlayerState{
    repeat: boolean;
    playing: boolean;
    currentTime: number;
    volume: number;
    playbackSpeed: number;
    effect: EffectType;
    effectOptions: any;
}