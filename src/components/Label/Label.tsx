import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';
import { contrast } from '../utils/color';

const labelSizeStyle = (common: ComponentProperties, size: ComponentSize) => {
    return {
        padding: `${common.padding[size] * 0.5}px ${common.padding[size]}px`,
        borderRadius: `${common.borderRadius[size]}px`
    };
};

const labelColorStyle = (palette: Palette, color: ComponentColor) => {
    return {
        backgroundColor: palette[color].color,
        color: palette[color].contrastText
    };
};

const labelGhostStyle = (palette: Palette, color: ComponentColor) => {
    return {
        backgroundColor: 'transparent',
        border: `1px solid ${palette[color].color}`,
        color: palette[color].color
    };
};

const labelFlatStyle = (palette: Palette, color: ComponentColor) => {
    return {
        backgroundColor: 'transparent',
        color: palette[color].color
    };
};

const labelStyles = (theme: Theme) => {
    const common = theme.components.common;
    return {
        '&.label-size-sm': labelSizeStyle(common, 'sm'),
        '&.label-size-md': labelSizeStyle(common, 'md'),
        '&.label-size-lg': labelSizeStyle(common, 'lg'),
        '&:not(.label-ghost):not(.label-flat)': {
            '&.label-color-default': labelColorStyle(theme.palette, 'default'),
            '&.label-color-primary': labelColorStyle(theme.palette, 'primary')
        },
        '&.label-ghost': {
            '&.label-color-default': labelGhostStyle(theme.palette, 'default'),
            '&.label-color-primary': labelGhostStyle(theme.palette, 'primary')
        },
        '&.label-flat': {
            '&.label-color-default': labelFlatStyle(theme.palette, 'default'),
            '&.label-color-primary': labelFlatStyle(theme.palette, 'primary')
        }
    };
};

export interface LabelProps extends React.HTMLAttributes<{}>{
    color?: string;
    size?: ComponentSize;
    ghost?: boolean;
    flat?: boolean;
}

export default ({ color, size, ghost, flat, children, className, style, ...others }: LabelProps) => {
    let combinedStyle: React.CSSProperties = { ...style };
    let isThemeColor = (color === 'default' || color === 'primary');
    if (color && !isThemeColor) {
        combinedStyle.backgroundColor = color;
        combinedStyle.color = contrast(color);
    }
    return (
        <label css={labelStyles} className={
            combineClassNames(
                color === 'default' || color === 'primary' ? `label-color-${color}` : '',
                `label-size-${size || 'md'}`,
                ghost ? 'label-ghost' : '',
                flat ? 'label-flat' : '',
                className
            )
        } style={combinedStyle} {...others}>
            {
                children
            }
        </label>
    );
};