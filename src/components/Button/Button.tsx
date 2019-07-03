import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';
import { shade, fade } from '../utils/color';
import verticalAlign from '../mixins/verticalAlign';

export interface ButtonProps extends React.ButtonHTMLAttributes<{}>{
    link?: boolean;
    href?: string;
    ghost?: boolean;
    shape?: ComponentShape;
    color?: ComponentColor;
    size?: ComponentSize;
    flat?: boolean;
    selected?: boolean;
    Component?: React.RefForwardingComponent<any, any>;
}

const genButtonColorStyle = (palette: Palette, color: ComponentColor) => {
    return {
        backgroundColor: palette[color].color,
        color: palette[color].contrastText,
        '&:not(.button-disabled)': {
            '&:hover': {
                backgroundColor: shade(palette[color].color, palette.action.shade.hover)
            },
            '&:active': {
                backgroundColor: shade(palette[color].color, palette.action.shade.active)
            },
            '&.button-selected': {
                backgroundColor: fade(palette.typography.body, palette.action.shade.selected)
            }
        }
    };
};

const genFlatButtonColorStyle = (palette: Palette, color: ComponentColor) => {
    return {
        color: color === 'default' ? palette[color].contrastText : palette[color].color,
        backgroundColor: 'transparent',
        '&:not(.button-disabled)': {
            '&:hover': {
                backgroundColor: fade(palette.typography.body, palette.action.fade.hover)
            },
            '&:active': {
                backgroundColor: fade(palette.typography.body, palette.action.fade.active)
            },
            '&.button-selected': {
                backgroundColor: fade(palette.typography.body, palette.action.fade.selected)
            }
        }
    };
};

const genFlatButtonStyle = (palette: Palette) => {
    return {
        '&.button-color-default': genFlatButtonColorStyle(palette, 'default'),
        '&.button-color-primary': genFlatButtonColorStyle(palette, 'primary')
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
    const c = palette[color].color;
    const bgColorHover = fade(c, palette.action.fade.hover);
    const bgColorActive = fade(c, palette.action.fade.active);
    const bgColorSelected = fade(c, palette.action.fade.selected);
    const colorHover = shade(c, palette.action.shade.hover);
    const colorActive = shade(c, palette.action.shade.active);
    const colorSelected = shade(c, palette.action.shade.selected);
    return {
        color: palette[color].color,
        borderColor: palette[color].color,
        backgroundColor: 'transparent',
        '&:not(.button-disabled)': {
            '&:hover': {
                color: colorHover,
                borderColor: colorHover,
                backgroundColor: bgColorHover
            },
            '&:active': {
                backgroundColor: bgColorActive,
                color: colorActive,
                borderColor: colorActive
            },
            '&.button-selected': {
                backgroundColor: bgColorSelected,
                color: colorSelected,
                borderColor: colorSelected
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
        textTransform: 'capitalize',
        transition: `0.2s ${theme.transitions['easeOutSine']} all`,
        ...verticalAlign(),
        ...theme.typography.button,
        '&.button-disabled': {
            opacity: palette.action.fade.disabled,
            pointerEvents: 'not-allowed'
        },
        '&.button-size-sm': genButtonSizeStyle(commonProperties, 'sm'),
        '&.button-size-md': genButtonSizeStyle(commonProperties, 'md'),
        '&.button-size-lg': genButtonSizeStyle(commonProperties, 'lg'),
        '&:not(.button-ghost)': {
            '&.button-color-default': genButtonColorStyle(palette, 'default'),
            '&.button-color-primary': genButtonColorStyle(palette, 'primary')
        },
        '&.button-ghost': genGhostButtonStyle(palette),
        '&.button-flat': genFlatButtonStyle(palette),
        '&.button-block': {
            display: 'block'
        }
    };
};

export default React.forwardRef(({
    link, flat, color, size, shape, ghost, selected,
    Component, href, className, children, ...others
}: React.PropsWithChildren<ButtonProps>, ref: React.Ref<any>) => {
    let combinedClassName = combineClassNames(
        `button-size-${size || 'md'}`,
        `button-color-${color || 'default'}`,
        `button-shape-${shape || 'rounded'}`,
        selected ? 'button-selected' : '',
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