import immerPlugin from '@rematch/immer';
import { Action, Reducer, combineReducers } from 'redux';
import {
    ACTION_SWITCH_EFFECT,
    ACTION_EFFECT_OPTIONS_CHANGE,
    ACTION_LOAD_SOURCE_SUCCESS,
    ACTION_ZOOM,
    ACTION_CLIP_REGION_CHANGE
} from './models/editor/types';
import { ACTION_UNDO, ACTION_REDO } from './models/history/types';
import undoable, { FilterFunction } from 'redux-undo';

const buildHistoryOptions = (filter: FilterFunction) => {
    return {
        undoType: ACTION_UNDO,
        redoType: ACTION_REDO,
        filter
    };
};

const immerCombineReducers = immerPlugin().config!.redux!.combineReducers;

export default [
    {
        config: {
            redux: {
                initialState: {
                    past: [],
                    present: undefined,
                    future: []
                },
                combineReducers: (reducers: Dictionary<Reducer>) => {
                    const rootReducer = (immerCombineReducers || combineReducers)(reducers);
                    return undoable(rootReducer, buildHistoryOptions(({ type }: Action<string>) => {
                        // return [
                        //     `editor/${ACTION_LOAD_SOURCE_SUCCESS}`,
                        //     `editor/${ACTION_SWITCH_EFFECT}`,
                        //     `editor/${ACTION_EFFECT_OPTIONS_CHANGE}`,
                        //     `editor/${ACTION_ZOOM}`,
                        //     `editor/${ACTION_CLIP_REGION_CHANGE}`
                        // ].indexOf(type) > -1;
                        return false;
                    }));
                }
            }
        }
    }
];