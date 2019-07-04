import React, { useEffect, useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdDragHandle } from 'react-icons/md';
import useMovement from '../../hooks/useMovement';
import Tooltip from '../Tooltip';
import { TooltipProps } from '../Tooltip/Tooltip';
import { toTimeString } from '../../utils/time';
import TimeLabel from './TimeLabel';

const DRAG_REGION_WIDTH = 8;

const TOOLTIP_POSITION: Pick<TooltipProps, 'anchorPos' | 'transformPos'> = {
    anchorPos: { horizontal: 'center', vertical: 'top' },
    transformPos: { horizontal: 'center', vertical: 'bottom' }
};

const timelineRegionStyles = (theme: Theme): any => {
    return {
        position: 'absolute',
        top: 0,
        height: '100%',
        boxSizing: 'border-box',
        borderRadius: `${theme.components.common.borderRadius.md}px`,
        border: `2px solid ${theme.palette.action.color.borderColorSelected}`,
        '.region-drag-start, .region-drag-end': {
            position: 'absolute',
            width: `${DRAG_REGION_WIDTH}px`,
            height: '80%',
            top: '10%',
            backgroundColor: theme.palette.action.color.borderColorSelected,
            cursor: 'ew-resize',
            '.region-drag-icon': {
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) rotate(90deg)'
            }
        },
        '.region-drag-start': {
            left: `-${DRAG_REGION_WIDTH * 0.5}px`
        },
        '.region-drag-end': {
            right: `-${DRAG_REGION_WIDTH * 0.5}px`
        }
    };
};

const RegionSideWithTimeLabel = TimeLabel((props: React.HTMLAttributes<{}>) => {
    return (
        <div {...props}></div>
    );
});

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
    return (
        <div css={timelineRegionStyles} style={combinedStyle} {...others}>
            <RegionSideWithTimeLabel onMouseDown={dragStartHook.onMouseDown} />
            <RegionSideWithTimeLabel onMouseDown={dragEndHook.onMouseDown} />
        </div>
    );
};