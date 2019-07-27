import immerPlugin from '@rematch/immer';
import { Action } from 'redux';
import { merge } from 'lodash';
import historyPlugin from './models/history/enhancer';
import { ACTION_LOAD_SOURCE_SUCCESS } from './models/source/types';
import { ACTION_SEEK, ACTION_SOURCE_CHANGE, ACTION_ZOOM, ACTION_CLIP_REGION_CHANGE } from './models/timeline/types';
import { ACTION_SWITCH_EFFECT, ACTION_EFFECT_OPTIONS_CHANGE } from './models/effect/type';
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
                `source/${ACTION_LOAD_SOURCE_SUCCESS}`,
                `effect/${ACTION_SWITCH_EFFECT}`,
                `effect/${ACTION_EFFECT_OPTIONS_CHANGE}`,
                `timeline/${ACTION_SOURCE_CHANGE}`,
                `timeline/${ACTION_SEEK}`,
                `timeline/${ACTION_ZOOM}`,
                `timeline/${ACTION_CLIP_REGION_CHANGE}`
            ].indexOf(type) > -1;
        }))
    )
];