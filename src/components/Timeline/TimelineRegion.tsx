import React, { useEffect, useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdDragHandle } from 'react-icons/md';
import useMovement from '../../hooks/useMovement';
import Tooltip from '../Tooltip';
import { TooltipProps } from '../Tooltip/Tooltip';
import { toTimeString } from '../../utils/time';

const DRAG_REGION_WIDTH = 4;

const TOOLTIP_POSITION: Pick<TooltipProps, 'anchorPos' | 'transformPos'> = {
    anchorPos: { horizontal: 'center', vertical: 'top' },
    transformPos: { horizontal: 'center', vertical: 'bottom' }
};

const timelineRegionStyles = (theme: Theme): any => {
    return {
        position: 'absolute',
        top: 0,
        height: '100%',
        border: `2px solid ${theme.palette.action.color.borderColorSelected}`,
        boxSizing: 'border-box',
        '.region-drag-start, .region-drag-end': {
            position: 'absolute',
            width: `${DRAG_REGION_WIDTH}px`,
            height: '80%',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            '.region-drag-icon': {
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) rotate(90deg)'
            }
        }
    };
};

export interface TimelineRegionProps extends React.HTMLAttributes<{}>{
    start: number;
    end: number;
    pixelsPerMSec: number;
    onRegionChange?: (v: {start?: number; end?: number}) => void;
}

export default ({ start, end, pixelsPerMSec, onRegionChange, style, ...others }: TimelineRegionProps) => {
    const s = start || 0;
    const e = end || 0;
    const ppms = pixelsPerMSec || 0.05;
    const dragStartHook = useMovement();
    const dragEndHook = useMovement();
    const [lastStart, setLastStart] = useState(s);
    const [lastEnd, setLastEnd] = useState(e);
    useEffect(() => {
        if (dragStartHook.hasDown && !dragStartHook.isDragging) {
            setLastStart(s);
        }
    }, [s, dragStartHook.hasDown, dragStartHook.isDragging]);
    useEffect(() => {
        if (dragEndHook.hasDown && !dragEndHook.isDragging) {
            setLastEnd(e);
        }
    }, [e, dragEndHook.hasDown, dragEndHook.isDragging]);
    useEffect(() => {
        if (dragStartHook.hasDown && dragStartHook.isDragging) {
            let start = lastStart + (dragStartHook.curPos.x - dragStartHook.lastPos.x) / ppms;
            onRegionChange && onRegionChange({ start });
        }
    }, [dragStartHook.hasDown, dragStartHook.isDragging, lastStart, ppms, dragStartHook.lastPos.x, dragStartHook.curPos.x, onRegionChange]);
    useEffect(() => {
        if (dragEndHook.hasDown && dragEndHook.isDragging) {
            let end = lastEnd + (dragEndHook.curPos.x - dragEndHook.lastPos.x) / ppms;
            onRegionChange && onRegionChange({ end });
        }
    }, [dragEndHook.hasDown, dragEndHook.isDragging, lastEnd, ppms, dragEndHook.lastPos.x, dragEndHook.curPos.x, onRegionChange]);
    const combinedStyle: React.CSSProperties = {
        display: s !== e ? 'block' : 'none',
        left: `${s * ppms}px`,
        width: `${(e - s) * ppms}px`,
        ...style
    };
    const dragStartStyle: React.CSSProperties = {
        left: `${s * ppms}px`
    };
    const dragEndStyle: React.CSSProperties = {
        left: `${e * ppms}px`
    };
    return (
        <div css={timelineRegionStyles} style={combinedStyle} {...others}>
            <Tooltip title={toTimeString(s)} {...TOOLTIP_POSITION}>
                <div className="region-drag-start" style={dragStartStyle} onMouseDown={dragStartHook.onMouseDown}>
                    <MdDragHandle className="region-drag-icon" />
                </div>
            </Tooltip>
            <Tooltip title={toTimeString(e)} {...TOOLTIP_POSITION}>
                <div className="region-drag-end" style={dragEndStyle} onMouseDown={dragEndHook.onMouseDown}>
                    <MdDragHandle className="region-drag-icon" />
                </div>
            </Tooltip>
        </div>
    );
};