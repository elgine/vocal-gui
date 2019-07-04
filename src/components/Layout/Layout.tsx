import React from 'react';
/** @jsx jsx */
import { jsx, Global, css } from '@emotion/core';

import { scale, slide, fade } from '../transitions';
import scrollBar from '../mixins/scrollBar';


const layoutStyles = css(`
position: relative;
width: 100%;
height: 100%;
`);

const genLayoutStyle = (theme: Theme): any => {
    const { body, paragraph, heading1, heading2, heading3, heading4, heading5, heading6 } = theme.typography;
    return {
        'button, input, textarea': {
            outline: 'none'
        },
        'body, ul, li': {
            margin: 0,
            padding: 0
        },
        'ul, li': {
            listStyle: 'none'
        },
        'img[src=""], img:not([src])': {
            opacity: 0
        },
        'body': {
            fontFamily: theme.typography.fontFamily,
            backgroundColor: theme.palette.background.body,
            color: theme.palette.typography.body,
            ...body
        },
        'p': {
            ...paragraph
        },
        'h1': {
            ...heading1
        },
        'h2': {
            ...heading2
        },
        'h3': {
            ...heading3
        },
        'h4': {
            ...heading4
        },
        'h5': {
            ...heading5
        },
        'h6': {
            ...heading6
        },
        ...scrollBar(theme.components.scrollBar),
        ...scale,
        ...slide,
        ...fade
    };
};

export interface LayoutProps extends React.HTMLAttributes<{}>{

}

export default ({ children, ...others }: React.PropsWithChildren<LayoutProps>) => {
    return (
        <div css={layoutStyles} {...others}>
            <Global styles={genLayoutStyle} />
            {children}
        </div>
    );
};