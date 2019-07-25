export const ACTION_CALL_HOTKEY = 'ACTION_CALL_HOTKEY';
export const ACTION_UPDATE_HOTKEYS = 'ACTION_UPDATE_HOTKEYS';
export const REDUCER_SET_HOTKEYS = 'REDUCER_SET_HOTKEYS';

export interface Hotkey{
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    keyCode: number;
}

export interface HotkeyAction{
    hotkey: Hotkey;
    action: {
        title: string;
        value: string;
    };
}

export interface HotkeysState{
    hotkeyActionMap: Dictionary<HotkeyAction>;
    actionHotkeyMap: Dictionary<string>;
}