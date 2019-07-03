import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

const avatarSizeStyle = (common: ComponentProperties, size: ComponentSize) => {
    return {
        width: `${common.height[size]}px`,
        height: `${common.height[size]}px`,
        lineHeight: `${common.height[size]}px`,
        '&.avatar-shape-rounded': {
            borderRadius: `${common.borderRadius[size]}px`
        }
    };
};

const avatarColorStyle = (palette: Palette, color: ComponentColor) => {
    return {
        backgroundColor: palette[color].color,
        color: palette[color].contrastText
    };
};

const avatarStyles = (theme: Theme): any => {
    const common = theme.components.common;
    return {
        display: 'inline-block',
        position: 'relative',
        textAlign: 'center',
        'img': {
            display: 'block',
            width: '100%',
            height: '100%'
        },
        '&.avatar-color-default': avatarColorStyle(theme.palette, 'default'),
        '&.avatar-color-primary': avatarColorStyle(theme.palette, 'primary'),
        '&.avatar-size-sm': avatarSizeStyle(common, 'sm'),
        '&.avatar-size-md': avatarSizeStyle(common, 'md'),
        '&.avatar-size-lg': avatarSizeStyle(common, 'lg'),
        '&.avatar-shape-circular': {
            borderRadius: '50%'
        }
    };
};

export interface AvatarProps extends React.HTMLAttributes<{}>{
    size?: number | string;
    color?: string;
    src?: string;
    alt?: string;
    srcSet?: string;
    shape?: ComponentShape;
}

export default ({ size, color, src, srcSet, shape, alt, className, style, ...others }: AvatarProps) => {
    let combinedClassName = `avatar-shape-${shape}`;
    let combinedStyle: React.CSSProperties = {};
    size = size || 'md';
    if (size === 'sm' || size === 'md' || size === 'lg') {
        combinedClassName += ` avatar-size-${size}`;
    } else {
        size = typeof size === 'number' ? size + 'px' : size;
        combinedStyle.lineHeight = combinedStyle.height = combinedStyle.width = size;
    }
    if (className) {
        combinedClassName += ` ${className}`;
    }

    color = color || 'default';
    if (color === 'default' || color === 'primary') {
        combinedClassName += ` avatar-color-${color}`;
    } else {
        combinedStyle.backgroundColor = color;
    }
    if (style) {
        combinedStyle = Object.assign(combinedStyle, style);
    }

    return (
        <span css={avatarStyles} className={combinedClassName} style={combinedStyle} {...others}>
            {
                (!src || src === '' || !srcSet || srcSet === '') ? (alt ? alt.charAt(0) : '') : (
                    <img src={src} srcSet={srcSet} />
                )
            }
        </span>
    );
};