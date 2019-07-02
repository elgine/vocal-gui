import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';
import { contrast, fade } from '../utils/color';

const listItemSizeStyle = (common: ComponentProperties, size: ComponentSize) => {
    return {
        padding: `${common.padding[size] * 0.5}px ${common.padding[size]}px`,
    };
};

const listItemStyles = (theme: Theme): any => {
    const { common } = theme.components;
    return {
        boxSizing: 'border-box',
        '&.list-disabled': {
            pointerEvents: 'none',
            opacity: theme.palette.action.fade.disabled
        },
        '&:not(.list-disabled)': {
            '&:hover': {
                backgroundColor: fade(contrast(theme.palette.background.body), theme.palette.action.fade.hover)
            },
            '&:active, &.list-selected': {
                backgroundColor: fade(contrast(theme.palette.background.body), theme.palette.action.fade.active)
            },
            '&.list-selected': {
                backgroundColor: fade(contrast(theme.palette.background.body), theme.palette.action.fade.selected)
            }
        },
        '&.list-item-size-sm': listItemSizeStyle(common, 'sm'),
        '&.list-item-size-md': listItemSizeStyle(common, 'md'),
        '&.list-item-size-lg': listItemSizeStyle(common, 'lg')
    };
};

export interface ListItemProps extends React.LiHTMLAttributes<{}>{
    value?: string;
    size?: ComponentSize;
    disabled?: boolean;
    selected?: boolean;
}

export default ({ selected, disabled, size, children, className, ...others }: React.PropsWithChildren<ListItemProps>) => {
    return (
        <li css={listItemStyles}
            className={
                combineClassNames(
                    `list-item-size-${size || 'md'}`,
                    disabled ? 'list-disabled' : '',
                    selected ? 'list-selected' : '',
                    className
                )
            }
            {...others}
        >
            {children}
        </li>
    );
};