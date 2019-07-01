import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';

const cardTitleStyles = (theme: Theme): any => {
    return {
        textAlign: 'center',
        padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
        fontSize: '0.8rem',
        '&.card-title-nowrap': {
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        },
        '.card-title-inner': {
            textAlign: 'left'
        }
    };
};

export interface CardTitleProps extends React.HTMLAttributes<{}>{
    title?: string;
    nowrap?: boolean;
}

export default ({ title, nowrap, className, ...others }: CardTitleProps) => {
    return (
        <div css={cardTitleStyles} className={
            combineClassNames(nowrap ? 'card-title-nowrap' : '', className)
        } {...others}>
            <span className="card-title-inner">
                {
                    title
                }
            </span>
        </div>
    );
};