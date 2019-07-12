import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';

export default createMuiTheme({
    palette: {
        type: 'light',
        primary: blue,
        secondary: red
    }
});