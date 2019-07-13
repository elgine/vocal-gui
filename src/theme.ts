import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export default createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#bb86fc',
            contrastText: '#000'
        },
        secondary: {
            main: '#03dac6',
            contrastText: '#000'
        },
        background: {
            default: '#121212',
            paper: '#1f1f1f'
        }
    }
});