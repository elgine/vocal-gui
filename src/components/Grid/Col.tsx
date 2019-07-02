import React from 'react';
/** @jsx jsx */
import { jsx, ClassNames } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import combineClassNames from '../../utils/combineClassNames';
import { clamp } from 'lodash';
import Box, { BoxProps } from './Box';

const GRID_COUNT = 12;

const spanStyle = (i: number, max: number = GRID_COUNT, size: ComponentSize = 'md') => {
    return {
        [`&.col-span-${i}-${size}`]: {
            width: `${i / max * 100}%`
        }
    };
};

const pullStyle = (i: number, max: number = GRID_COUNT, size: ComponentSize = 'md') => {
    return {
        [`&.col-pull-${i}-${size}`]: {
            marginLeft: `${i / max * 100}%`
        }
    };
};

const pushStyle = (i: number, max: number = GRID_COUNT, size: ComponentSize = 'md') => {
    return {
        [`&.col-pull-${i}-${size}`]: {
            marginRight: `${i / max * 100}%`
        }
    };
};

const spanStyles = (max: number = GRID_COUNT, size: ComponentSize = 'md') => {
    return Array(max).fill(0).reduce((obj, item, i) => {
        return Object.assign(obj, spanStyle(i + 1, max, size));
    }, {});
};

const pullStyles = (max: number = GRID_COUNT, size: ComponentSize = 'md') => {
    return Array(max).fill(0).reduce((obj, item, i) => {
        return Object.assign(obj, pullStyle(i + 1, max, size));
    }, {});
};

const pushStyles = (max: number = GRID_COUNT, size: ComponentSize = 'md') => {
    return Array(max).fill(0).reduce((obj, item, i) => {
        return Object.assign(obj, pushStyle(i + 1, max, size));
    }, {});
};

const responsive = (breakpoint: Breakpoint) => {
    return Object.entries(breakpoint).reduce((style, [size, width], i, arr) => {
        const key = '@media screen and ' + (i === 0 ? `(max-width: ${width}px)` : `(min-width: ${arr[i - 1][1] + 1}px) and (max-width: ${width}px)`);
        return Object.assign(style, {
            [key]: {
                ...pushStyles(GRID_COUNT, size as ComponentSize),
                ...pullStyles(GRID_COUNT, size as ComponentSize),
                ...spanStyles(GRID_COUNT, size as ComponentSize)
            }
        }, i === arr.length - 1 ? {
            [`@media screen and (min-width: ${width}px)`]: {
                ...pushStyles(GRID_COUNT, size as ComponentSize),
                ...pullStyles(GRID_COUNT, size as ComponentSize),
                ...spanStyles(GRID_COUNT, size as ComponentSize)
            }
        } : undefined);
    }, {});
};

const colStyles = (theme: Theme): any => {
    let styles = {
        position: 'relative',
        boxSizing: 'border-box',
        display: 'inline-block',
        '&.left': {
            textAlign: 'left'
        },
        '&.center': {
            textAlign: 'center'
        },
        '&.right': {
            textAlign: 'right'
        },
        '&.middle, &.top, &.bottom': {
            '&:before': {
                content: '""',
                height: '100%',
                display: 'inline-block'
            },
            '&>*': {
                display: 'inline-block'
            }
        },
        '&.middle': {
            '&>*, &:before': {
                verticalAlign: 'middle'
            }
        },
        '&.top': {
            '&>*, &:before': {
                verticalAlign: 'top'
            }
        },
        '&.bottom': {
            '&>*, &:before': {
                verticalAlign: 'bottom'
            }
        },
        ...responsive(theme.breakpoint)
    };
    return styles;
};

export interface ColProps extends BoxProps{
    theme: Theme;
    pull?: number|ResponsiveProperty<number>;
    push?: number|ResponsiveProperty<number>;
    span?: number|ResponsiveProperty<number>;
    verticalAlign?: 'top' | 'middle' | 'bottom';
    horizontalAlign?: 'left' | 'center' | 'right';
}

const genPropertyResponsiveClassName = (key: string, val?: number|ResponsiveProperty<number>, def?: boolean) => {
    if (val) {
        if (typeof val === 'object') {
            return Object.entries(val).reduce((str, v) => str + ` col-${key}-${clamp(v[1], 1, GRID_COUNT)}-${v[0]}`, '');
        } else {
            return `col-${key}-${clamp(val, 1, GRID_COUNT)}-sm col-${key}-${clamp(val, 1, GRID_COUNT)}-md col-${key}-${clamp(val, 1, GRID_COUNT)}-lg`;
        }
    }
    return def ? `col-${key}-${clamp(12, 1, GRID_COUNT)}-sm col-${key}-${clamp(12, 1, GRID_COUNT)}-md col-${key}-${clamp(12, 1, GRID_COUNT)}-lg` : '';
};

export default withTheme(({ children, pull, push, span, verticalAlign, horizontalAlign, className, theme, ...others }: React.PropsWithChildren<ColProps>) => {
    return (
        <ClassNames>
            {
                ({ css, cx }) => (
                    <Box className={
                        combineClassNames(
                            css(colStyles(theme)),
                            verticalAlign || '',
                            horizontalAlign || '',
                            genPropertyResponsiveClassName('pull', pull),
                            genPropertyResponsiveClassName('push', push),
                            genPropertyResponsiveClassName('span', span),
                            className
                        )
                    } {...others}>
                        {children}
                    </Box>
                )
            }
        </ClassNames>
    );
});