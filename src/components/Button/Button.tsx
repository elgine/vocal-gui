import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';
import { shade, fade } from '../utils/color';
import verticalAlign from '../mixins/verticalAlign';

export type ButtonShape = 'circular' | 'rounded';

export interface ButtonProps extends React.ButtonHTMLAttributes<{}>{
    link?: boolean;
    href?: string;
    ghost?: boolean;
    shape?: ButtonShape;
    color?: ComponentColor;
    size?: ComponentSize;
    flat?: boolean;
    Component?: React.RefForwardingComponent<any, any>;
}

const genButtonColorStyle = (palette: Palette, color: ComponentColor) => {
    return {
        backgroundColor: palette[color].color,
        color: palette[color].contrastText,
        '&:not(.button-disabled)': {
            '&:hover': {
                backgroundColor: shade(palette[color].color, palette.action.hover)
            },
            '&:active': {
                backgroundColor: shade(palette[color].color, palette.action.active)
            }
        }
    };
};

const genIconButtonColorStyle = (palette: Palette, color: ComponentColor) => {
    return {
        color: color === 'default' ? palette[color].contrastText : palette[color].color,
        backgroundColor: 'transparent',
        '&:not(.button-disabled)': {
            '&:hover': {
                backgroundColor: fade(palette.background.contrastText, 0.04)
            },
            '&:active': {
                backgroundColor: fade(palette.background.contrastText, 0.08)
            }
        }
    };
};

const genIconButtonStyle = (palette: Palette) => {
    return {
        '&.button-color-default': genIconButtonColorStyle(palette, 'default'),
        '&.button-color-primary': genIconButtonColorStyle(palette, 'primary')
    };
};

const genButtonSizeStyle = (commonProperties: ComponentProperties, size: ComponentSize) => {
    return {
        padding: `0 ${commonProperties.padding[size]}px`,
        height: `${commonProperties.height[size]}px`,
        '&.button-shape-circular': {
            borderRadius: `${commonProperties.height[size]}px`
        },
        '&.button-shape-rounded': {
            borderRadius: `${commonProperties.borderRadius[size]}px`
        }
    };
};

const genGhostButtonColorStyle = (palette: Palette, color: ComponentColor) => {
    const colorHover = shade(palette[color].color, palette.action.hover);
    const colorActive = shade(palette[color].color, palette.action.active);
    return {
        color: palette[color].color,
        borderColor: palette[color].color,
        '&:not(.button-disabled)': {
            '&:hover': {
                color: colorHover,
                borderColor: colorActive
            },
            '&:active': {
                color: colorActive,
                borderColor: colorActive
            }
        }
    };
};

const genGhostButtonStyle = (palette: Palette) => {
    return {
        [`&.button-color-default`]: genGhostButtonColorStyle(palette, 'default'),
        [`&.button-color-primary`]: genGhostButtonColorStyle(palette, 'primary')
    };
};

const genButtonStyle = (theme: Theme): any => {
    const palette = theme.palette;
    const commonProperties = theme.components.common;
    return {
        display: 'inline-block',
        boxSizing: 'border-box',
        border: '1px solid transparent',
        outline: 'none',
        background: 'transparent',
        textTransform: 'uppercase',
        transition: `0.2s ${theme.transitions['easeOutSine']} all`,
        ...verticalAlign(),
        ...theme.typography.button,
        '&.button-disabled': {
            opacity: palette.action.disabledOpacity
        },
        '&.button-size-sm': genButtonSizeStyle(commonProperties, 'sm'),
        '&.button-size-md': genButtonSizeStyle(commonProperties, 'md'),
        '&.button-size-lg': genButtonSizeStyle(commonProperties, 'lg'),
        '&.button-color-default': genButtonColorStyle(palette, 'default'),
        '&.button-color-primary': genButtonColorStyle(palette, 'primary'),
        '&.button-ghost': genGhostButtonStyle(palette),
        '&.button-flat': genIconButtonStyle(palette),
        '&.button-block': {
            display: 'block'
        }
    };
};

export default React.forwardRef(({
    link, flat, color, size, shape, ghost, Component,
    href, className, children, ...others
}: React.PropsWithChildren<ButtonProps>, ref: React.Ref<any>) => {
    let combinedClassName = combineClassNames(
        `button-size-${size || 'md'}`,
        `button-color-${color || 'default'}`,
        `button-shape-${shape || 'rounded'}`,
        ghost ? 'button-ghost' : '',
        flat ? 'button-flat' : '',
        others.disabled ? 'button-disabled' : '',
        className
    );
    if (Component) {
        return (
            <Component ref={ref} className={combinedClassName} css={genButtonStyle} {...others}>{children}</Component>
        );
    } else if (link) {
        return (
            <a ref={ref} className={combinedClassName} css={genButtonStyle} href={href} {...others}>{children}</a>
        );
    } else {
        return (
            <button ref={ref} className={combinedClassName} css={genButtonStyle} {...others}>
                {children}
            </button>
        );
    }
});