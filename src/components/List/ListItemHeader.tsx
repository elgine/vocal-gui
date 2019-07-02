import React from 'react';
/** @jsx jsx */
import { jsx, css, ClassNames } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import ListItem from './ListItem';
import verticalAlign from '../mixins/verticalAlign';
import combineClassNames from '../../utils/combineClassNames';

const listItemHeaderStyles = (theme: Theme): any => {
    return {
        padding: `0 ${theme.components.common.padding}`,
        color: theme.palette.typography.caption,
        fontSize: '0.8rem',
        ...verticalAlign()
    };
};

export default withTheme(({ children, theme, className, ...others }: React.PropsWithChildren<React.HTMLAttributes<{}> & {theme: Theme}>) => {
    return (
        <ClassNames>
            {
                ({ css, cx }) => (
                    <ListItem className={
                        combineClassNames(
                            css(listItemHeaderStyles(theme)),
                            className
                        )
                    } {...others}>
                        {children}
                    </ListItem>
                )
            }
        </ClassNames>
    );
});