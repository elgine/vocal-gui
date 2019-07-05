import React, { useState, useRef, useCallback, useEffect } from 'react';
import Pointer, { PointerProps } from './Pointer';
import Label from '../Label';
import Popover from '../Popover';
import { LabelProps } from '../Label/Label';
import { PopoverProps } from '../Popover/Popover';

const DELTA_DURATION_HIDE_LABEL = 1000;

export interface PointerWithLabelProps extends Pick<PointerProps, 'headerPos' | 'hasHeader' | 'onMouseDown'|'onMouseOver'|'onMouseOut'|'onMouseUp' | 'className' | 'style'>,
    Pick<PopoverProps, 'anchorPos' | 'transformPos' | 'offset'>, Pick<LabelProps, 'flat' | 'size' | 'color' | 'ghost'>{
    label?: string;
    labelVisible?: boolean;
}

export default ({
    label, color, flat, size, ghost,
    offset, anchorPos, transformPos, labelVisible,
    headerPos, onMouseDown, onMouseOver, onMouseOut, onMouseUp,
    ...others
}: PointerWithLabelProps) => {
    const o = offset || 16;
    const hp = headerPos || 'top';
    const [timer, setTimer] = useState(-1);
    const pointerRef = useRef<HTMLElement>(null);
    const [showLabel, setShowLabel] = useState(false);
    const [dragging, setDragging] = useState(false);
    useEffect(() => {
        setShowLabel(labelVisible || false);
    }, [labelVisible]);
    const onShow = useCallback(() => {
        clearTimeout(timer);
        if (labelVisible === undefined)setShowLabel(true);
    }, [timer, labelVisible]);
    const onHide = useCallback(() => {
        setDragging(false);
        clearTimeout(timer);
        if (labelVisible === undefined) {
            setShowLabel(false);
        }
    }, [timer, labelVisible]);
    const onHideDelay = useCallback(() => {
        clearTimeout(timer);
        setTimer(window.setTimeout(() => {
            if (labelVisible === undefined) {
                setShowLabel(false);
            }
        }, DELTA_DURATION_HIDE_LABEL));
    }, [timer, labelVisible]);
    const onHidden = useCallback(() => {
        setDragging(false);
        onHide();
    }, [onHide]);
    const onMouseDownWrapped = (e: React.MouseEvent) => {
        onShow();
        setDragging(true);
        e.preventDefault();
        onMouseDown && onMouseDown(e);
    };
    const onMouseOverWrapped = (e: React.MouseEvent) => {
        onShow();
        onMouseOver && onMouseOver(e);
    };
    const onMouseOutWrapped = (e: React.MouseEvent) => {
        !dragging && onHideDelay();
        onMouseOut && onMouseOut(e);
    };
    const onMouseUpWrapped = (e: React.MouseEvent) => {
        setDragging(false);
        onMouseUp && onMouseUp(e);
    };
    // useEffect(() => console.log(pointerRef.current), [pointerRef.current]);
    return (
        <Pointer ref={pointerRef} color={color} headerPos={hp} {...others}
            onMouseDown={onMouseDownWrapped} onMouseOver={onMouseOverWrapped}
            onMouseOut={onMouseOutWrapped} onMouseUp={onMouseUpWrapped}>
            <Popover anchorEl={pointerRef.current} offset={o}
                anchorPos={{ horizontal: 'center', vertical: hp === 'top' ? 'top' : 'bottom' }}
                transformPos={{ horizontal: 'center', vertical: hp === 'bottom' ? 'top' : 'bottom' }}
                visible={showLabel} onClose={onHidden}>
                <Label flat={flat} color={color} size={size} ghost={ghost} style={{ fontSize: '0.75rem' }}>
                    {label}
                </Label>
            </Popover>
        </Pointer>
    );
};