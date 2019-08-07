import React, { useContext } from 'react';
import { RematchDispatch } from '@rematch/core';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Toolbar, Theme, Button, Typography } from '@material-ui/core';
import Placeholder from '../components/Placeholder';
import { makeStyles  } from '@material-ui/styles';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import { shade } from '../utils/color';
import { getLang, LangContext } from '../lang';
import { RootState } from '../store';

const Logo = (props: React.ImgHTMLAttributes<{}>) => {
    const logoSrc = `logo/logo.png`;
    return (
        <img src={logoSrc} {...props} />
    );
};

const MinimizeIcon = ({ style, size, ...others }: React.SVGAttributes<{}> & {size?: number | string}) => {
    const combinedStyle: React.CSSProperties = {
        fill: 'currentColor',
        width: size ? `${size}px` : 'inherit',
        height: size ? `${size}px` : 'inherit',
        ...style
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" style={combinedStyle} {...others}>
            <path d="M2048 819v205H0V819h2048z" />
        </svg>
    );
};

const MaximizeIcon = ({ style, size, ...others }: React.SVGAttributes<{}> & {size?: number | string}) => {
    const combinedStyle: React.CSSProperties = {
        fill: 'currentColor',
        width: size ? `${size}px` : 'inherit',
        height: size ? `${size}px` : 'inherit',
        ...style
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" style={combinedStyle} {...others}>
            <path d="M2048 0v2048H0V0h2048zm-205 205H205v1638h1638V205z" />
        </svg>
    );
};

const RestoreIcon = ({ style, size, ...others }: React.SVGAttributes<{}> & {size?: number}) => {
    const combinedStyle: React.CSSProperties = {
        fill: 'currentColor',
        width: size ? `${size}px` : 'inherit',
        height: size ? `${size}px` : 'inherit',
        ...style
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" style={combinedStyle} {...others}>
            <path d="M2048 1638h-410v410H0V410h410V0h1638v1638zM1434 614H205v1229h1229V614zm409-409H614v205h1024v1024h205V205z" />
        </svg>
    );
};

const CloseIcon = ({ style, size, ...others }: React.SVGAttributes<{}> & {size?: number}) => {
    const combinedStyle: React.CSSProperties = {
        fill: 'currentColor',
        width: size ? `${size}px` : 'inherit',
        height: size ? `${size}px` : 'inherit',
        ...style
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" style={combinedStyle} {...others}>
            <path d="M1169 1024l879 879-145 145-879-879-879 879L0 1903l879-879L0 145 145 0l879 879L1903 0l145 145z" />
        </svg>
    );
};

export interface TitleBarProps extends Omit<ToolbarProps, 'title'>{
    title?: React.ReactNode;
    height?: number;
}

const ICON_SIZE = 12;

const useStyles = makeStyles((theme: Theme) => {
    return {
        root: {
            position: 'absolute',
            width: '100%',
            boxSizing: 'border-box',
            zIndex: 1,
            backgroundColor: theme.palette.background.paper
        },
        title: {
            padding: `${theme.spacing(1)}px`,
        },
        windowBtn: {
            minWidth: '46px',
            height: '100%',
            borderRadius: 0
        },
        closeBtn: {
            '&:hover': {
                backgroundColor: theme.palette.error[theme.palette.type],
                color: theme.palette.error.contrastText
            },
            '&:active': {
                backgroundColor: shade(theme.palette.error[theme.palette.type], -0.12)
            }
        }
    };
});

const mapStateToProps = ({ present }: RootState) => {
    return {
        ...present.window
    };
};

export default ({ title, height, className, style, ...others }: TitleBarProps) => {
    const lang = useContext(LangContext);
    const { state } = useSelector(mapStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch>();
    const classes = useStyles();
    const h = height || 32;
    const isDesktop = true;
    const combinedStyle = {
        height: `${h}px`,
        minHeight: `${h}px`,
        ...style
    };

    const onMinimize = () => dispatch({ type: 'electron/minimize' });
    const onMaximizeRestore = () => {
        if (state === 'maximize') {
            dispatch({ type: 'electron/restore' });
        } else {
            dispatch({ type: 'electron/maximize' });
        }
    };
    const onClose = () => dispatch({ type: 'electron/close' });

    const dragRegionStyle: any = {
        WebkitUserSelect: 'none',
        WebkitAppRegion: 'drag'
    };
    return (
        <Toolbar variant="dense" disableGutters className={clsx(classes.root, className)} style={combinedStyle} {...others}
            onDoubleClick={onMaximizeRestore}>
            <Logo height="100%" />
            <Typography className={classes.title} color="textPrimary" variant="caption">
                {title || 'VOCAL'}
            </Typography>
            <Placeholder style={dragRegionStyle} />
            {
                isDesktop ? (
                    <React.Fragment>
                        <Button className={classes.windowBtn} title={getLang('MINIMIZE', lang)}
                            disableRipple disableFocusRipple onClick={onMinimize}>
                            <MinimizeIcon size={ICON_SIZE} />
                        </Button>
                        <Button className={classes.windowBtn} title={getLang('MAXIMIZE', lang)}
                            disableRipple disableFocusRipple onClick={onMaximizeRestore}>
                            {
                                state === 'normal' ? <MaximizeIcon size={ICON_SIZE} /> : <RestoreIcon size={ICON_SIZE} />
                            }
                        </Button>
                        <Button className={clsx(classes.windowBtn, classes.closeBtn)} title={getLang('CLOSE', lang)}
                            disableRipple disableFocusRipple onClick={onClose}>
                            <CloseIcon size={ICON_SIZE} />
                        </Button>
                    </React.Fragment>
                ) : undefined
            }
        </Toolbar>
    );
};