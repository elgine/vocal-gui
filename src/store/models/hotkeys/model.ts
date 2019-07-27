import { RematchDispatch } from '@rematch/core';
import {
    HotkeyAction,
    Hotkey,
    HotkeysState,
    REDUCER_SET_HOTKEYS,
    ACTION_CALL_HOTKEY,
    ACTION_UPDATE_HOTKEYS
} from './types';
import { ACTION_UNDO, ACTION_REDO } from '../history/types';
import { ACTION_SWITCH_PLAYING } from '../player/types';
import { ACTION_ZOOM_OUT, ACTION_ZOOM_IN, ACTION_SKIP_PREVIOUS, ACTION_SKIP_NEXT } from '../timeline/types';
import { RootState } from '../..';

const getHotkeyId = (hotkey: Hotkey) => {
    return `${Number(hotkey.ctrl)}${Number(hotkey.shift)}${Number(hotkey.alt)}${hotkey.keyCode}`;
};

const defaultUndoHotkey = {
    ctrl: true,
    shift: false,
    alt: false,
    keyCode: 90
};
const defaultUndoHotkeyId = getHotkeyId(defaultUndoHotkey);

const defaultRedoHotkey = {
    ctrl: true,
    shift: false,
    alt: false,
    keyCode: 89
};
const defaultRedoHotkeyId = getHotkeyId(defaultRedoHotkey);

const defaultPlayHotkey = {
    ctrl: false,
    shift: false,
    alt: false,
    keyCode: 32
};
const defaultPlayHotkeyId = getHotkeyId(defaultPlayHotkey);

const defaultZoomOut = {
    ctrl: false,
    shift: false,
    alt: false,
    keyCode: 187
};
const defaultZoomOutHotkeyId = getHotkeyId(defaultZoomOut);

const defaultZoomIn = {
    ctrl: false,
    shift: false,
    alt: false,
    keyCode: 189
};
const defaultZoomInHotkeyId = getHotkeyId(defaultZoomIn);

const defaultSkipPrevious = {
    ctrl: true,
    shift: false,
    alt: false,
    keyCode: 119
};
const defaultSkipPreviousHotkeyId = getHotkeyId(defaultSkipPrevious);

const defaultSkipNext = {
    ctrl: true,
    shift: false,
    alt: false,
    keyCode: 120
};
const defaultSkipNextHotkeyId = getHotkeyId(defaultSkipNext);

const initialState: HotkeysState = {
    hotkeyActionMap: {
        [defaultSkipPreviousHotkeyId]: {
            id: defaultSkipPreviousHotkeyId,
            hotkey: defaultSkipPrevious,
            action: {
                title: 'SKIP_PREVIOUS',
                value: `player/${ACTION_SKIP_PREVIOUS}`
            }
        },
        [defaultSkipNextHotkeyId]: {
            id: defaultSkipNextHotkeyId,
            hotkey: defaultSkipNext,
            action: {
                title: 'SKIP_NEXT',
                value: `player/${ACTION_SKIP_NEXT}`
            }
        },
        [defaultZoomOutHotkeyId]: {
            id: defaultZoomOutHotkeyId,
            hotkey: defaultZoomOut,
            action: {
                title: 'ZOOM_OUT_TIMELINE',
                value: `timeline/${ACTION_ZOOM_OUT}`
            }
        },
        [defaultZoomInHotkeyId]: {
            id: defaultZoomInHotkeyId,
            hotkey: defaultZoomIn,
            action: {
                title: 'ZOOM_IN_TIMELINE',
                value: `timeline/${ACTION_ZOOM_IN}`
            }
        },
        [defaultPlayHotkeyId]: {
            id: defaultPlayHotkeyId,
            hotkey: defaultPlayHotkey,
            action: {
                title: 'TOGGLE',
                value: `player/${ACTION_SWITCH_PLAYING}`
            }
        },
        [defaultUndoHotkeyId]: {
            id: defaultUndoHotkeyId,
            hotkey: defaultUndoHotkey,
            action: {
                title: 'UNDO',
                value: ACTION_UNDO
            }
        },
        [defaultRedoHotkeyId]: {
            id: defaultRedoHotkeyId,
            hotkey: defaultRedoHotkey,
            action: {
                title: 'REDO',
                value: ACTION_REDO
            }
        }
    },
    actionHotkeyMap: {
        [ACTION_UNDO]: defaultUndoHotkeyId,
        [ACTION_REDO]: defaultRedoHotkeyId,
        [`player/${ACTION_SWITCH_PLAYING}`]: defaultPlayHotkeyId,
        [`timeline/${ACTION_ZOOM_IN}`]: defaultZoomInHotkeyId,
        [`timeline/${ACTION_ZOOM_OUT}`]: defaultZoomOutHotkeyId,
        [`player/${ACTION_SKIP_PREVIOUS}`]: defaultSkipPreviousHotkeyId,
        [`player/${ACTION_SKIP_NEXT}`]: defaultSkipNextHotkeyId
    }
};


export default {
    state: initialState,
    reducers: {
        [REDUCER_SET_HOTKEYS](state: HotkeysState, payload: Dictionary<HotkeyAction>) {
            /* eslint-disable */
            for (let k in payload) {
                const {action, hotkey} = payload[k];
                // Delete last hotkey record
                let lastHotkeyId = state.actionHotkeyMap[action.value];
                if(state.actionHotkeyMap[action.value]){
                    Reflect.deleteProperty(state.hotkeyActionMap, lastHotkeyId);
                }
                // Add new hotkey record
                let id = getHotkeyId(hotkey); 
                state.hotkeyActionMap[id] = {
                    id,
                    ...payload[k]
                };
                state.actionHotkeyMap[action.value] = id;
            }
            return state;
        }
    },
    effects: (dispatch: RematchDispatch) => ({
        [ACTION_CALL_HOTKEY]({hotkey, payload}: {hotkey: Hotkey, payload: any}, {present}: RootState) {
            let id = getHotkeyId(hotkey); 
            const action = present.hotkeys.hotkeyActionMap[id].action.value;
            dispatch({type: action, payload});
        },
        [ACTION_UPDATE_HOTKEYS](payload: Dictionary<HotkeyAction>) {
            dispatch.hotkeys[REDUCER_SET_HOTKEYS](payload);
        }
    })
};