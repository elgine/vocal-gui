import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import { Toolbar, IconButton, Tooltip, Dialog, Menu } from '@material-ui/core';
import { Undo, Redo, Flip as Clip } from '@material-ui/icons';
import Grow from '../components/Grow';
import { getLang, LangContext } from '../lang';

const mapStateToProps = (state: any) => {
    return {

    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(() => {
    const lang = useContext(LangContext);
    return (
        <React.Fragment>
            <Toolbar>
                <Tooltip title={getLang('UNDO', lang)}>
                    <IconButton>
                        <Undo />
                    </IconButton>
                </Tooltip>
                <Tooltip title={getLang('REDO', lang)}>
                    <IconButton>
                        <Redo />
                    </IconButton>
                </Tooltip>
                <Tooltip title={getLang('CLIP', lang)}>
                    <IconButton>
                        <Clip />
                    </IconButton>
                </Tooltip>
                <Grow />
            </Toolbar>
        </React.Fragment>
    );
});