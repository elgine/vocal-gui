import React from 'react';
import { Row } from '../Grid';
import ControlBarPlaceHolder from './ControlBarPlaceholder';
import { RowProps } from '../Grid/Row';

export interface ControlBarProps extends Omit<RowProps, 'theme'>{
    leftChildren?: React.ReactNode;
    centerChildren?: React.ReactNode;
    rightChildren?: React.ReactNode;
    leftBoxProps?: RowProps;
    centerBoxProps?: RowProps;
    rightProps?: RowProps;
}

export default ({
    leftChildren, centerChildren, rightChildren,
    leftBoxProps, centerBoxProps, rightProps,
    ...others
}: ControlBarProps) => {
    return (
        <Row ph="md" flex {...others}>
            <Row>
                {leftChildren}
            </Row>
            <ControlBarPlaceHolder horizontalAlign="center" {...centerBoxProps}>
                {centerChildren}
            </ControlBarPlaceHolder>
            <Row>
                {rightChildren}
            </Row>
        </Row>
    );
};