import React from 'react';
import Row, { RowProps } from './Row';

export default ({ style, ...others }: Omit<RowProps, 'theme'>) => {
    return (
        <Row style={{ flex: 1, flexShrink: 0, ...style }} {...others} />
    );
};