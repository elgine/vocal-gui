import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

const exportPanelStyles = (theme: Theme) => {
    return {

    };
};

export interface ExportPanelProps extends React.HTMLAttributes<{}>{

}

export default ({ ...others }: ExportPanelProps) => {
    return (
        <div css={exportPanelStyles} {...others}>

        </div>
    );
};