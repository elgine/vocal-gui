import React from 'react';
import Row, { RowProps } from '../Grid/Row';

export interface ControlBarPlaceHolderProps extends Omit<RowProps, 'theme'>{

}

export default ({ children, style, ...others }: React.PropsWithChildren<ControlBarPlaceHolderProps>) => {
    return (
        <Row style={{ flex: 1, flexShrink: 0, ...style }} {...others}>
            {children}
        </Row>
    );
};