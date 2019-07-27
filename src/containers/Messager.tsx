import React from 'react';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { SnackbarContentProps } from '@material-ui/core/SnackbarContent';
import { ACTION_HIDE_MESSAGE } from '../store/models/message/type';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { RootState } from '../store';

const useSnackbarContentStyles = makeStyles(theme => ({
    SUCCESS: {
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
    SUCCESS: CheckCircleIcon,
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
            className={clsx(classes[variant || 'INFO'], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
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

export interface MessagerProps{
    messageAutoHideDuraiton?: number;
}

const mapStateToProps = ({ present }: RootState) => {
    return {
        ...present.message
    };
};

export default React.memo(({ messageAutoHideDuraiton }: MessagerProps) => {
    const { showMsg, msgType, msg } = useSelector(mapStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch>();
    const onMessageClose = dispatch.message[ACTION_HIDE_MESSAGE];
    return (
        <Snackbar autoHideDuration={messageAutoHideDuraiton || 6000}
            open={showMsg} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            onClose={onMessageClose}>
            <SnackbarContentWrapper
                onClose={onMessageClose}
                variant={msgType}
                message={msg}
            />
        </Snackbar>
    );
}, (prevProps: MessagerProps, nextProps: MessagerProps) => {
    return prevProps.messageAutoHideDuraiton === nextProps.messageAutoHideDuraiton;
});