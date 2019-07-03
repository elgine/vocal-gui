import React from 'react';

export interface TabPaneProps{
    title?: string | React.ReactNode;
    value?: string;
}

export default ({ children }: React.PropsWithChildren<TabPaneProps>) => {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
};