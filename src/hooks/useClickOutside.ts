import { useEffect, useCallback } from 'react';

let registered = false;
let eventHandlers: Dictionary<Set<(e: MouseEvent) => void>> = {
    'mousedown': new Set<(e) => void>(),
    'mouseup': new Set<(e) => void>(),
    'click': new Set<(e) => void>()
};

const onMouseDownOutside = (e: MouseEvent) => {
    eventHandlers['mousedown'].forEach((fn) => fn(e));
};

const onMouseUpOutside = (e: MouseEvent) => {
    eventHandlers['mouseup'].forEach((fn) => fn(e));
};

const onClickOutside = (e: MouseEvent) => {
    eventHandlers['click'].forEach((fn) => fn(e));
};

const register = () => {
    if (registered) return;
    registered = true;
    document.body.addEventListener('mousedown', onMouseDownOutside);
    document.body.addEventListener('mouseup', onMouseUpOutside);
    document.body.addEventListener('click', onClickOutside);
};

export default (dom: HTMLElement|null, onClickOutside?: (e: MouseEvent) => void, e: 'mousedown'|'mouseup'|'click' = 'click') => {
    register();
    const onGlobalClick = useCallback((e: Event) => {
        const target = (e.target as HTMLElement);
        if (dom && (dom.contains(target) || dom === target)) return;
        onClickOutside && onClickOutside(e as MouseEvent);
    }, [dom, onClickOutside]);
    useEffect(() => {
        eventHandlers[e].add(onGlobalClick);
        return () => {
            eventHandlers[e].delete(onGlobalClick);
        };
    }, [onGlobalClick, e]);
};