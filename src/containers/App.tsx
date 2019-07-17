import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { SnackbarContentProps } from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import Editor from './Editor';
import combineClassNames from '../utils/combineClassNames';
import { MessageState, ACTION_HIDE_MESSAGE } from '../store/models/message/type';
import { EMPTY_STRING } from '../constant';

const useSnackbarContentStyles = makeStyles(theme => ({
    SUCESS: {
        backgroundColor: green[600],
    },
    ERROR: {
        backgroundColor: theme.palette.error.dark,
    },
    INFO: {
        backgroundColor: theme.palette.primary.main,
    },
    WARNING: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

const variantIcon = {
    SUCESS: CheckCircleIcon,
    WARNING: WarningIcon,
    ERROR: ErrorIcon,
    INFO: InfoIcon,
};

interface SnackbarContentWrapperProps extends SnackbarContentProps {
    variant?: MessageType;
    onClose?: () => void;
}

const SnackbarContentWrapper = (props: SnackbarContentWrapperProps) => {
    const classes = useSnackbarContentStyles();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant || 'INFO'];
    return (
        <SnackbarContent
            className={combineClassNames(classes[variant || 'INFO'], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={combineClassNames(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
};

const mapStateToProps = ({ message }: {message: MessageState}) => {
    return {
        ...message
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onMessageClose: dispatch.message[ACTION_HIDE_MESSAGE]
    };
};

export interface AppProps extends MessageState{
    messageAutoHideDuraiton?: number;
    onMessageClose: () => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(({ messageAutoHideDuraiton, showMsg, msg, msgType, onMessageClose }: AppProps) => {
    return (
        <React.Fragment>
            <Snackbar autoHideDuration={messageAutoHideDuraiton || 6000}
                open={showMsg} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                onClose={onMessageClose}>
                <SnackbarContentWrapper
                    onClose={onMessageClose}
                    variant={msgType}
                    message={msg}
                />
            </Snackbar>
            <Editor />
        </React.Fragment>
    );
});