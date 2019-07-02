import React, { useState, useEffect, useRef } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import useMovement from '../../hooks/useMovement';
import combineClassNames from '../../utils/combineClassNames';
import Tooltip from '../Tooltip';
import { clamp } from 'lodash';

const sliderStyles = (theme: Theme): any => {
    const sliderProps = theme.components.slider;
    return {
        display: 'inline-block',
        borderRadius: `${sliderProps.height}px`,
        '.slider': {
            position: 'relative',
            display: 'inline-block',
            backgroundColor: sliderProps.trackBackgroundColor,
            borderRadius: `${sliderProps.height}px`,
            margin: `${sliderProps.thumbSize * 0.5}px`,
            '&.slider-disabled': {
                opacity: theme.palette.action.fade.disabled,
                pointerEvents: 'none'
            },
            '&.slider-vertical': {
                width: `${sliderProps.height}px`,
                '&.slider-block': {
                    height: '100%'
                }
            },
            '&:not(.slider-vertical)': {
                height: `${sliderProps.height}px`,
                '&.slider-block': {
                    width: '100%'
                }
            },
            '.slider-highlight': {
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: theme.palette.primary.color
            },
            '.slider-thumb': {
                position: 'absolute',
                backgroundColor: sliderProps.thumbBackgroundColor,
                borderRadius: '50%',
                width: `${sliderProps.thumbSize}px`,
                height: `${sliderProps.thumbSize}px`,
                marginLeft: `-${sliderProps.thumbSize * 0.5}px`,
                marginTop: `-${sliderProps.thumbSize * 0.5}px`
            }
        }
    };
};

export interface SliderProps extends Omit<React.HTMLAttributes<{}>, 'onChange'>{
    vertical?: boolean;
    value?: number;
    width?: number;
    min?: number;
    max?: number;
    block?: boolean;
    disabled?: boolean;
    onChange?: (v: number) => void;
}

export default ({ value, vertical, disabled, block, width, min, max, onChange, style, ...others }: SliderProps) => {
    const w = width || 96;
    const v = value || 0;
    const mi = min || 0;
    const ma = max || 100;
    const [lastVal, setLastVal] = useState(v);
    const containerRef = useRef<HTMLDivElement>(null);
    const movementHook = useMovement();
    const hasDown = movementHook.hasDown;
    const isDragging = movementHook.isDragging;
    const downPos = movementHook.downPos;
    const curPos = movementHook.curPos;

    useEffect(() => {
        if (hasDown && !isDragging) {
            setLastVal(v);
        }
    }, [hasDown, isDragging, v]);

    useEffect(() => {
        if (containerRef.current && hasDown && isDragging) {
            let v = 0;
            if (vertical) {
                let ch = containerRef.current.offsetHeight;
                let val = -(curPos.y - downPos.y) / ch;
                v = lastVal + val * (ma - mi);
            } else {
                let cw = containerRef.current.offsetWidth;
                let val = (curPos.x - downPos.x) / cw;
                v = lastVal + val * (ma - mi);
            }
            if (v !== lastVal) {
                onChange && onChange(clamp(v, mi, ma));
            }
        }
    }, [vertical, hasDown, isDragging, lastVal, downPos, curPos, containerRef.current, ma, mi, onChange]);

    let highlightStyle: React.CSSProperties = {};
    let thumbStyle: React.CSSProperties = {};
    let percent = (v - mi) / (ma - mi) * 100;
    if (vertical) {
        highlightStyle.bottom = '0';
        highlightStyle.height = `${percent}%`;
        thumbStyle.left = '50%';
        thumbStyle.bottom = `${percent}%`;
    } else {
        highlightStyle.left = '0';
        highlightStyle.width = `${percent}%`;
        thumbStyle.left = `${percent}%`;
        thumbStyle.top = '50%';
    }

    const [showTooltip, setShowTooltip] = useState(false);
    useEffect(() => {
        if (hasDown && isDragging) {
            setShowTooltip(true);
        } else if (!hasDown && isDragging) {
            setShowTooltip(false);
        }
    }, [hasDown, isDragging]);
    const onMouseEnter = () => setShowTooltip(true);
    const onMouseLeave = () => !hasDown && setShowTooltip(false);

    let combinedStyle: React.CSSProperties = {
        ...style
    };
    if (!block) {
        if (!vertical) {
            combinedStyle.width = `${w}px`;
        } else {
            combinedStyle.height = `${w}px`;
        }
    }
    return (
        <div ref={containerRef} css={sliderStyles}>
            <div className={
                combineClassNames(
                    'slider',
                    disabled ? 'slider-disabled' : '',
                    vertical ? 'slider-vertical' : '',
                    block ? 'slider-block' : ''
                )
            } onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={combinedStyle} {...others}>
                <div className="slider-highlight" style={highlightStyle}></div>
                <Tooltip visible={showTooltip}
                    anchorPos={{ vertical: 'top', horizontal: 'center' }}
                    transformPos={{ vertical: 'bottom', horizontal: 'center' }}
                    title={v !== undefined ? (v === 0 ? '0.00' : (v).toFixed(2)) : undefined}
                >
                    <div className="slider-thumb" style={thumbStyle} onMouseDown={movementHook.onMouseDown}></div>
                </Tooltip>
            </div>
        </div>
    );
};