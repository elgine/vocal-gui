import React from 'react';
import { Box } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';

export default ({ style, ...others }: BoxProps) => {
    return (
        <Box style={{ flex: 1, height: '100%', ...style }} {...others} />
    );
};