import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import theme from '../theme';
import { LangContext, Lang } from '../lang';
import Editor from './Editor';

export default () => {
    return (
        <ThemeProvider theme={theme}>
            <LangContext.Provider value={Lang.CN}>
                <CssBaseline />
                <Editor />
            </LangContext.Provider>
        </ThemeProvider>
    );
};