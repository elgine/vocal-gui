import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';

const pointerStyles = (theme: Theme): any => {
    const pointer = theme.components.pointer;
    const bg = pointer.color;
    return {
        position: 'absolute',
        width: '2px',
        left: 0,
        top: 0,
        height: '100%',
        backgroundColor: bg,
        tranform: 'translateX(-50%)',
        cursor: 'ew-resize',
        '&.pointer-has-header': {
            '&:after': {
                transition: `0.12s ${theme.transitions.easeInSine} transform`,
                backgroundColor: 'inherit',
                content: '""',
                position: 'absolute',
                borderRadius: '50%',
                width: `${pointer.headerSize}px`,
                height: `${pointer.headerSize}px`,
                left: '50%',
                marginLeft: `-${pointer.headerSize * 0.5}px`
            },
            '&:hover, &:active': {
                '&:after': {
                    transform: 'scale(1.5, 1.5)'
                }
            },
            '&.pointer-header-pos-top': {
                '&:after': {
                    top: 0
                }
            },
            '&.pointer-header-pos-bottom': {
                '&:after': {
                    bottom: 0
                }
            }
        }
    };
};

export interface PointerProps extends React.HTMLAttributes<{}>{
    headerPos?: 'top' | 'bottom';
    hasHeader?: boolean;
    color?: string;
}

export default React.forwardRef(({ hasHeader, headerPos, className, color, style, children, ...others }: PointerProps, ref: React.Ref<any>) => {
    let combinedStyle: React.CSSProperties = {
        ...style
    };
    if (color) {
        combinedStyle.backgroundColor = color;
    }
    return (
        <div ref={ref} css={pointerStyles} className={
            combineClassNames(
                hasHeader ? 'pointer-has-header' : '',
                `pointer-header-pos-${headerPos || 'top'}`,
                className
            )
        } style={combinedStyle} {...others}>
            {children}
        </div>
    );
});