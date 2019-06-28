import React from 'react';
/** @jsx jsx */
import { jsx, ClassNames } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import combineClassNames from '../../utils/combineClassNames';
import Box, { BoxProps } from './Box';

const rowStyles = (theme: Theme): any => {
    const spacing = theme.spacing;
    return {
        position: 'relative',
        display: 'block',
        boxSizing: 'border-box',
        '&:after': {
            content: '""',
            clear: 'both',
            visibility: 'hidden'
        },
        '&.flex': {
            display: 'flex',
            '&.left': {
                justifyContent: 'flex-start'
            },
            '&.center': {
                justifyContent: 'center'
            },
            '&.right': {
                justifyContent: 'flex-end'
            },
            '&.middle': {
                alignItems: 'center'
            },
            '&.top': {
                alignItems: 'flex-start'
            },
            '&.bottom': {
                alignItems: 'flex-end'
            }
        },
        '&:not(.flex)': {
            '&:before': {
                content: '""',
                height: '100%',
                display: 'inline-block'
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
            '&.left': {
                textAlign: 'left'
            },
            '&.center': {
                textAlign: 'center'
            },
            '&.right': {
                textAlign: 'right'
            }
        },
        '&.gutter-sm': {
            '&>*': {
                padding: `${spacing.sm * 0.5}px`
            }
        },
        '&.gutter-md': {
            '&>*': {
                padding: `${spacing.md * 0.5}px`
            }
        },
        '&.gutter-lg': {
            '&>*': {
                padding: `${spacing.lg * 0.5}px`
            }
        }
    };
};

export interface RowProps extends BoxProps{
    theme: Theme;
    flex?: boolean;
    verticalAlign?: 'top' | 'middle' | 'bottom';
    horizontalAlign?: 'left' | 'center' | 'right';
    gutter?: ComponentSize;
}

export default withTheme(({ flex, verticalAlign, horizontalAlign, gutter, children, className, theme, ...others }: React.PropsWithChildren<RowProps>) => {
    return (
        <ClassNames>
            {
                ({ css }) => (
                    <Box className={combineClassNames(
                        css(rowStyles(theme)),
                        verticalAlign || 'middle',
                        horizontalAlign || 'left',
                        gutter ? `gutter-${gutter}` : '',
                        flex ? 'flex' : '',
                        className
                    )} {...others}>
                        {children}
                    </Box>
                )
            }
        </ClassNames>
    );
});