import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import amber from '@material-ui/core/colors/amber';
import grey from '@material-ui/core/colors/grey';

export default createMuiTheme({
    palette: {
        type: 'light',
        primary: grey,
        secondary: amber
    }
});