import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';

const pointerStyles = (theme: Theme): any => {
    const pointer = theme.components.pointer;
    const bg = pointer.color;
    return {
        position: 'absolute',
        bottom: 0,
        width: '1px',
        top: 0,
        left: 0,
        backgroundColor: bg,
        '.time-label': {
            position: 'absolute',
            bottom: '100%',
            transform: 'translateX(-50%)'
        },
        '&:hover, &:active': {
            opacity: 0.6
        },
        '&.pointer-has-header': {
            top: `${pointer.headerSize}px`,
            '&:after': {
                backgroundColor: 'inherit',
                content: '""',
                position: 'absolute',
                left: `-${pointer.headerSize * 0.5}px`,
                top: `-${pointer.headerSize}px`,
                width: `${pointer.headerSize}px`,
                height: `${pointer.headerSize}px`,
                transform: 'rotate(45deg)'
            }
        }
    };
};

export interface PointerProps extends React.HTMLAttributes<{}>{
    hasHeader?: boolean;
    color?: string;
    pixelsPerMSec?: number;
    time?: number;
}

export default ({ hasHeader, className, color, time, pixelsPerMSec, style, ...others }: PointerProps) => {
    const t = time || 0;
    const ppms = pixelsPerMSec || 0.05;
    const left = t * ppms;
    let combinedStyle: React.CSSProperties = {
        left: `${left}px`,
        ...style
    };
    if (color) {
        combinedStyle.backgroundColor = color;
    }
    return (
        <div css={pointerStyles} className={
            combineClassNames(
                hasHeader ? 'pointer-has-header' : '',
                className
            )
        } style={combinedStyle} {...others}></div>
    );
};