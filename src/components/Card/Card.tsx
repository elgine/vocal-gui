import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';

const cardStyles = (theme: Theme): any => {
    return {
        position: 'relative',
        border: '1px solid transparent',
        boxSizing: 'border-box',
        borderRadius: `${theme.components.common.borderRadius.md}px`,
        '&.card-selected': {
            borderColor: theme.palette.action.borderColorSelected
        },
        '&.card-disabled': {
            opacity: theme.palette.action.disabledOpacity,
            pointerEvents: 'none'
        }
    };
};

export interface CardProps extends React.HTMLAttributes<{}>{
    disabled?: boolean;
    selected?: boolean;
}

export default ({ className, selected, disabled, children, ...others }: React.PropsWithChildren<CardProps>) => {
    const combinedClassName = combineClassNames(
        selected ? 'card-selected' : '',
        disabled ? 'card-disabled' : '',
        className
    );
    return (
        <div css={cardStyles} className={combinedClassName} {...others}>
            {children}
        </div>
    );
};