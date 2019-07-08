import React, { useState, useLayoutEffect } from 'react';
import throttle from 'lodash/throttle';
import distance from '../utils/distance';
import { DELTA_FOR_DRAG_DETECTION } from '../constant';

const mouseCoordHandler = (e: React.MouseEvent|MouseEvent, corrector?: (v: Point) => Point) => {
    let c = {
        x: e.pageX,
        y: e.pageY
    };
    return corrector ? corrector(c) : c;
};

function useMovement(corrector?: (v: Point) => Point, throttleInterval?: number) {
    const thi = throttleInterval || 30;
    const [hasDown, setHasDown] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [downPos, setDownPos] = useState({ x: 0, y: 0 });
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [curPos, setCurPos] = useState({ x: 0, y: 0 });
    const onMouseDown = (e: React.MouseEvent) => {
        // e.preventDefault();
        setHasDown(true);
        setIsDragging(false);
        setDownPos(mouseCoordHandler(e, corrector));
        setLastPos({ x: curPos.x, y: curPos.y });
        setCurPos(mouseCoordHandler(e, corrector));
    };
    useLayoutEffect(() => {
        const mouseMoveFn = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setCurPos(mouseCoordHandler(e, corrector));
        };
        const onMouseMove = throttle(mouseMoveFn, thi);
        const onMouseUp = (e: MouseEvent) => setHasDown(false);
        const initMouseListeners = () => {
            document.body.addEventListener('mousemove', onMouseMove);
            document.body.addEventListener('mouseup', onMouseUp);
        };
        const uninitMouseListeners = () => {
            document.body.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mouseup', onMouseUp);
        };
        if (hasDown) {
            initMouseListeners();
        }
        return uninitMouseListeners;
    }, [hasDown, corrector, thi]);
    useLayoutEffect(() => {
        if (hasDown && !isDragging && distance(curPos, downPos) >= DELTA_FOR_DRAG_DETECTION) {
            setIsDragging(true);
        }
        setLastPos({ x: curPos.x, y: curPos.y });
    }, [hasDown, isDragging, curPos, downPos]);
    return {
        onMouseDown,
        isDragging,
        hasDown,
        downPos,
        curPos,
        lastPos
    };
}

export default useMovement;