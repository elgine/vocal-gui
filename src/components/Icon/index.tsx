import React from 'react';
/** @jsx jsx */
import { jsx, css, ClassNames } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import { IconBaseProps } from 'react-icons';
import combineClassNames from '../../utils/combineClassNames';

export interface IconProps extends Omit<IconBaseProps, 'size' | 'color'>{
    size?: number | ComponentSize;
    color?: string | ComponentColor;
}

const iconStyles = (theme: Theme): any => {
    const icon = theme.components.icon;
    return {
        '&.icon-color-default': {
            color: theme.palette.default.color
        },
        '&.icon-color-primary': {
            color: theme.palette.primary.color
        },
        '&.icon-size-sm': {
            fontSize: `${icon.sm}px`
        },
        '&.icon-size-md': {
            fontSize: `${icon.md}px`
        },
        '&.icon-size-lg': {
            fontSize: `${icon.lg}px`
        }
    };
};

export default withTheme((props: React.PropsWithChildren<IconProps & { theme: Theme}>) => {
    if (!props.children || typeof props.children !== 'object') return null;
    if (typeof props.size === 'number' && props.color !== 'default' && props.color !== 'primary') {
        const { children, ...others } = props;
        return React.cloneElement(children as any, others);
    }
    const { size, color, className, theme, children, ...others } = props;
    return (
        <ClassNames>
            {
                ({ css, cx }) => (
                    React.cloneElement(children as any, {
                        className: combineClassNames(
                            css(iconStyles(theme)),
                            size ? `icon-size-${size}` : '',
                            color ? `icon-color-${color}` : '',
                            className
                        ),
                        ...others
                    })
                )
            }
        </ClassNames>
    );
});