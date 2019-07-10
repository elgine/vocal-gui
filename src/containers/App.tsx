import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';

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

export default connect(mapStateToProps, mapDispatchToProps)((props: AppProps) => {
    return (
        <ThemeProvider theme={theme}>

        </ThemeProvider>
    );
});