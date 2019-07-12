import React from 'react';
import { connect } from 'react-redux';
import TimeScale from '../components/TimeScale';
import { Box } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import {} from '@material-ui/icons';

const mapStateToProps = (state: any) => {
    return {};
};

const mapDispatchToProps = (dispatch: any) => {
    return {

    };
};

export interface TimelinePanelProps extends BoxProps{}

export default connect(mapStateToProps, mapDispatchToProps)(({ ...others }: TimelinePanelProps) => {
    return (
        <Box {...others}>
            <TimeScale />

        </Box>
    );
});