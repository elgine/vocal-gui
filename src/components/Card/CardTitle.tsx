import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import combineClassNames from '../../utils/combineClassNames';
import { shade } from '../utils/color';
import gutter from '../mixins/gutter';

const cardTitleStyles = (theme: Theme): any => {
    const palette = theme.palette;
    const { lineHeight, ...caption } = theme.typography.caption;
    return {
        padding: `0 ${theme.spacing.md}px`,
        '&.card-gutter-sm': gutter(theme.spacing.sm, true, true),
        '&.card-gutter-md': gutter(theme.spacing.md, true, true),
        '&.card-gutter-lg': gutter(theme.spacing.lg, true, true),
        '&.card-title-nowrap': {
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        },
        '.card-desc': {
            color: theme.palette.typography.caption,
            ...caption
        }
    };
};

export interface CardTitleProps extends React.HTMLAttributes<{}>{
    title?: string;
    desc?: string;
    nowrap?: boolean;
    gutter?: ComponentSize;
}

export default ({ title, desc, nowrap, gutter, className, ...others }: CardTitleProps) => {
    return (
        <div css={cardTitleStyles} className={
            combineClassNames(
                nowrap ? 'card-title-nowrap' : '',
                gutter ? `card-gutter-${gutter}` : '',
                className
            )
        } {...others}>
            <div className="card-title-inner">
                {
                    title
                }
            </div>
            {
                desc ? <div className="card-desc">{desc}</div> : undefined
            }
        </div>
    );
};