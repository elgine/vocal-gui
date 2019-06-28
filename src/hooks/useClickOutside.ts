import { useEffect, useCallback } from 'react';

let registered = false;
let eventHandlers: Dictionary<(() => void)[]> = {
    'mousedown': [],
    'mouseup': [],
    'click': []
};

const onMouseDownOutside = (e: MouseEvent) => {
    eventHandlers['mousedown'].forEach(() => );
};

const onMouseUpOutside = (e: MouseEvent) => {

};

const onClickOutside = (e: MouseEvent) => {

};

const register = () => {
    if (registered) return;
    document.body.addEventListener('mousedown', onMouseDownOutside);
    document.body.addEventListener('mouseup', onMouseUpOutside);
    document.body.addEventListener('click', onClickOutside);
};

export default (dom: HTMLElement|null, onClickOutside?: (e: MouseEvent) => void, e: 'mousedown'|'mouseup'|'click' = 'click') => {
    const onGlobalClick = useCallback((e: Event) => {
        const target = (e.target as HTMLElement);
        if (dom && (dom.contains(target) || dom === target)) return;
        onClickOutside && onClickOutside(e as MouseEvent);
    }, [dom, onClickOutside]);
    useEffect(() => {
        document.body.addEventListener(e, onGlobalClick);
        return () => {
            document.body.removeEventListener(e, onGlobalClick);
        };
    }, [onGlobalClick, e]);
};