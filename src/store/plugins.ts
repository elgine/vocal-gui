import immerPlugin from '@rematch/immer';
import { Action } from 'redux';
import { merge } from 'lodash';
import historyPlugin from './models/history/enhancer';
import {
    ACTION_SWITCH_EFFECT,
    ACTION_EFFECT_OPTIONS_CHANGE,
    ACTION_LOAD_SOURCE_SUCCESS,
    ACTION_SEEK,
    ACTION_SOURCE_CHANGE,
    ACTION_ZOOM,
    ACTION_CLIP_REGION_CHANGE
} from './models/editor/types';
import { ACTION_UNDO, ACTION_REDO } from './models/history/types';
import { FilterFunction } from 'redux-undo';

const buildHistoryOptions = (filter: FilterFunction) => {
    return {
        undoType: ACTION_UNDO,
        redoType: ACTION_REDO,
        filter
    };
};

export default [
    merge(
        immerPlugin(),
        historyPlugin(buildHistoryOptions(({ type }: Action<string>) => {
            return [
                `editor/${ACTION_LOAD_SOURCE_SUCCESS}`,
                `editor/${ACTION_SWITCH_EFFECT}`,
                `editor/${ACTION_EFFECT_OPTIONS_CHANGE}`,
                `editor/${ACTION_SOURCE_CHANGE}`,
                `editor/${ACTION_ZOOM}`,
                `editor/${ACTION_CLIP_REGION_CHANGE}`
            ].indexOf(type) > -1;
        }))
    )
];