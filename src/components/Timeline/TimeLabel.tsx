import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

const TRIANGLE_SIZE = 8;

const timeLabelStyles = (theme: Theme): any => {
    return {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: `${theme.spacing.sm}px`,
        '&:after': {
            position: 'absolute',
            content: '""',
            left: '50%',
            borderWidth: `${TRIANGLE_SIZE}px`,
            transform: 'translateX(-50%)'
        },
        '&.time-label-top': {
            bottom: '100%',
            '&:after': {
                bottom: `-${TRIANGLE_SIZE}px`,
                borderStyle: 'solid dashed dashed dashed',
                borderColor: 'inherit transparent transparent transparent'
            }
        },
        '&.time-label-bottom': {
            top: '100%',
            '&:after': {
                top: `-${TRIANGLE_SIZE}px`,
                borderStyle: 'dashed dashed solid dashed',
                borderColor: 'transparent transparent inherit transparent'
            }
        },
        '&.time-label-transparent': {
            background: 'none'
        }
    };
};

export interface TimeLabelProps{
    position?: 'top' | 'bottom';
    transparent?: boolean;
    title?: string;
}

function TimeLabel<T>(Component: React.ComponentType<T>) {
    return (props: React.PropsWithChildren<T & TimeLabelProps>) => {
        const { position, transparent, children, title, ...others } = props;
        return (
            <Component {...others as any}>
                {children}
                <span css={timeLabelStyles} className={`time-label-${position || 'top'}`}>{title}</span>
            </Component>
        );
    };
}

export default TimeLabel;