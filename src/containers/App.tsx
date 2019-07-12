import React, { useRef, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { Box } from '@material-ui/core';
import theme from './theme';
import { getLang, LangContext, Lang } from '../lang';
import PlayerControls from './PlayerControls';

const mapStateToProps = (state: any) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {

    };
};

export interface AppProps{

}

const BODY_BACKGROUND = {
    light: '#fff',
    dark: '#121212'
};

const playerControlsStyle: React.CSSProperties = {
    position: 'absolute',
    boxSizing: 'border-box',
    bottom: '0',
    width: '100%',
    left: '0'
};

export default connect(mapStateToProps, mapDispatchToProps)((props: AppProps) => {
    return (
        <ThemeProvider theme={theme}>
            <LangContext.Provider value={Lang.CN}>
                <Box bgcolor={BODY_BACKGROUND[theme.palette.type]} height="100%"
                    color={theme.palette.getContrastText(theme.palette.background.default)}>

                    <PlayerControls style={playerControlsStyle} />
                </Box>
            </LangContext.Provider>
        </ThemeProvider>
    );
});