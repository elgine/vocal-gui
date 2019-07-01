import React from 'react';
import { withTheme } from 'emotion-theming';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

export interface TitleLoaderProps extends IContentLoaderProps{}

export default withTheme(({ theme, ...others }: TitleLoaderProps & {theme: Theme}) => {
    return (
        <ContentLoader
            height={60}
            width={300}
            speed={2}
            primaryColor={theme.palette.default.color}
            secondaryColor={theme.palette.background.surface}
            {...others}
        >
            <circle cx="30" cy="30" r="30" />
            <rect x="75" y="13" rx="4" ry="4" width="100" height="13" />
            <rect x="75" y="37" rx="4" ry="4" width="50" height="8" />
        </ContentLoader>
    );
});