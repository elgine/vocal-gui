import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { deepPurple, teal } from '@material-ui/core/colors';

export default createMuiTheme({
    palette: {
        type: 'dark',
        // primary: deepPurple,
        primary: {
            main: '#bb86fc',
            dark: '#bb86fc',
            light: '#6200ee',
            contrastText: '#000'
        },
        secondary: teal,
        // secondary: {
        //     main: '#03dac6',
        //     contrastText: '#000'
        // },
        background: {
            default: '#121212',
            paper: '#1f1f1f'
        }
    }
});