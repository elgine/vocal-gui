import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';

const dividerStyles = (theme: Theme) => {
    return {
        backgroundColor: theme.palette.border.divider,
        '&:not(.divider-vertical)': {
            width: '100%',
            height: '1px',
            '&.margin-size-sm': {
                margin: `${theme.spacing.sm}px 0`
            },
            '&.margin-size-md': {
                margin: `${theme.spacing.sm}px 0`
            },
            '&.margin-size-lg': {
                margin: `${theme.spacing.sm}px 0`
            }
        },
        '&.divider-vertical': {
            width: '1px',
            height: '100%',
            '&.margin-size-sm': {
                margin: `0 ${theme.spacing.sm}px`
            },
            '&.margin-size-md': {
                margin: `0 ${theme.spacing.sm}px`
            },
            '&.margin-size-lg': {
                margin: `0 ${theme.spacing.sm}px`
            }
        }
    };
};

export interface DividerProps extends BaseComponentProps{
    vertical?: boolean;
    margin?: ComponentSize;
}

export default ({ vertical, className, margin, ...others }: DividerProps) => {
    return (
        <div className={combineClassNames(margin ? `margin-size-${margin || 'md'}` : '', vertical ? 'divider-vertical' : '', className)} css={dividerStyles} {...others}></div>
    );
};