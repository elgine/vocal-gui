import React from 'react';
import { withTheme } from 'emotion-theming';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

export interface TitleLoaderProps extends IContentLoaderProps{}

export default withTheme(({ theme, ...others }: TitleLoaderProps & {theme: Theme}) => {
    return (
        <ContentLoader
            height={48}
            width={300}
            speed={2}
            primaryColor="#444"
            secondaryColor="#323232"
            {...others}
        >
            <circle cx="24" cy="24" r="24" />
            <rect x="64" y="9" rx="4" ry="4" width="100" height="14" />
            <rect x="64" y="31" rx="4" ry="4" width="50" height="8" />
        </ContentLoader>
    );
});