import React, { useState } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import Select, { Option } from '../components/Select/Select';


const editorStyles = (theme: Theme): any => {
    return {
        boxSizing: 'border-box',

    };
};

export default () => {
    return (
        <div css={editorStyles}>
            <Select>
                <Option value="t1">t1</Option>
                <Option value="t2">t2</Option>
                <Option value="t3">t3</Option>
            </Select>
        </div>
    );
};