import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import App from './containers/App';
import store from './store';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import { CssBaseline } from '@material-ui/core';

render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </Provider>
    , document.getElementById('app')
);