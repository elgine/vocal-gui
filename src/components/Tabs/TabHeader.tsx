import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';
import vertialAlign from '../mixins/verticalAlign';

const tabHeaderStyles = (theme: Theme): any => {
    const spacing = theme.spacing;
    return {
        cursor: 'pointer',
        boxSizing: 'border-box',
        ...vertialAlign(),
        '.tab-header-inner': {
            padding: `${spacing.md * 0.5}px ${spacing.md}px`
        },
        '&.tab-header-vertical': {
            textAlign: 'center'
        },
        '&.tab-header-selected': {
            '.tab-header-inner': {
                borderRadius: `${theme.components.common.borderRadius.md}px`,
                backgroundColor: theme.palette.background.surface
            }
        }
    };
};

export interface TabHeaderProps extends React.HTMLAttributes<{}>{
    selected?: boolean;
    vertical?: boolean;
}

export default ({ children, selected, vertical, className, ...others }: React.PropsWithChildren<TabHeaderProps>) => {
    return (
        <div css={tabHeaderStyles} className={
            combineClassNames(
                'tab-header',
                vertical ? 'tab-header-vertical' : '',
                selected ? 'tab-header-selected' : '',
                className
            )
        } {...others}>
            <span className="tab-header-inner">
                {children}
            </span>
        </div>
    );
};