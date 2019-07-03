import React from 'react';
import { Row, Grow } from '../Grid';
import { RowProps } from '../Grid/Row';

export interface ControlBarProps extends Omit<RowProps, 'theme'>{
    leftChildren?: React.ReactNode;
    centerChildren?: React.ReactNode;
    rightChildren?: React.ReactNode;
    leftBoxProps?: RowProps;
    centerBoxProps?: RowProps;
    rightProps?: RowProps;
}

export default React.forwardRef(({
    leftChildren, centerChildren, rightChildren,
    leftBoxProps, centerBoxProps, rightProps,
    ...others
}: ControlBarProps, ref: React.Ref<any>) => {
    return (
        <Row ref={ref} ph="md" flex {...others}>
            <Row>
                {leftChildren}
            </Row>
            <Grow horizontalAlign="center" {...centerBoxProps}>
                {centerChildren}
            </Grow>
            <Row>
                {rightChildren}
            </Row>
        </Row>
    );
});