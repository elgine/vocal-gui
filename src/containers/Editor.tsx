import React, { useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import Select, { Option } from '../components/Select';
import ExportPanel from './ExportPanel';

const editorStyles = (theme: Theme): any => {
    return {
        boxSizing: 'border-box'
    };
};

export default () => {
    return (
        <div css={editorStyles}>
            <ExportPanel />
        </div>
    );
};