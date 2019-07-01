import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import Loading from '../Loading';

const cardCoverStyles = (theme: Theme): any => {
    const card = theme.components.card;
    const spacing = theme.spacing;
    return {
        position: 'relative',
        width: '100%',
        paddingBottom: '80%',
        backgroundColor: card.coverBackgroundColor,
        backgroundSize: 'contain',
        backgroundPosition: 'center center',
        borderRadius: `${theme.components.common.borderRadius.md}px`,
        backgroundRepeat: 'no-repeat',
        '.loading': {
            position: 'absolute',
            left: `${spacing.sm}px`,
            bottom: `${spacing.sm}px`,
            width: '20px',
            height: '20px'
        },
        '.content': {
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0
        }
    };
};

export interface CardCoverProps extends React.HTMLAttributes<{}>{
    src?: string;
    loading?: boolean;
}

export default ({ style, src, loading, children, ...others }: CardCoverProps) => {
    let combinedStyle: React.CSSProperties = {
        ...style
    };
    if (src) {
        combinedStyle.backgroundImage = `url(${src})`;
    }
    return (
        <div css={cardCoverStyles} {...others} style={combinedStyle}>
            <div className="content">
                {
                    loading ? <Loading className="loading" /> : undefined
                }
                {children}
            </div>
        </div>
    );
};