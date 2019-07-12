import React from 'react';
import { connect } from 'react-redux';
import { Box, Toolbar, IconButton } from '@material-ui/core';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import Volume from '../components/Volume';
import PlayButton from '../components/PlayButton';
import RepeatButton from '../components/RepeatButton';
import Grow from '../components/Grow';

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = () => {
    return {};
};

export interface PlayerControlsProps extends ToolbarProps{
    playing?: boolean;
}

export default connect(mapStateToProps, mapDispatchToProps)((props: PlayerControlsProps) => {
    return (
        <Toolbar {...props}>
            <Volume />
            <Grow textAlign="center">
                <PlayButton />
            </Grow>
            <RepeatButton />
        </Toolbar>
    );
});