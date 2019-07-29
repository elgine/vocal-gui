import React, { useContext } from 'react';
import { Toolbar, Theme, Button, Typography } from '@material-ui/core';
import Placeholder from '../components/Placeholder';
import { makeStyles } from '@material-ui/styles';
import { ToolbarProps } from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import { contrast } from '../utils/color';
import { getLang, LangContext } from '../lang';
import { SettingsOutlined } from '@material-ui/icons';

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
            padding: `0 ${theme.spacing(1) * 0.5}px 0 ${theme.spacing(2)}px`,
            zIndex: 1,
            backgroundColor: contrast(theme.palette.text.primary)
        },
        windowBtn: {
            minWidth: '46px',
            height: '100%'
        }
    };
});

export default ({ title, height, className, style, ...others }: TitleBarProps) => {
    const lang = useContext(LangContext);
    const classes = useStyles();
    const h = height || 32;
    const isDesktop = true;
    const combinedStyle = {
        height: `${h}px`,
        minHeight: `${h}px`,
        ...style
    };
    return (
        <Toolbar variant="dense" className={clsx(classes.root, className)} style={combinedStyle} {...others}>
            <Typography variant="h6">
                {title || 'Vocal'}
            </Typography>
            <Placeholder />
            <Button className={classes.windowBtn}>
                <SettingsOutlined fontSize="small" />
            </Button>
            {
                isDesktop ? (
                    <React.Fragment>
                        <Button className={classes.windowBtn} title={getLang('MINIMIZE', lang)}
                            disableRipple disableFocusRipple>
                            <MinimizeIcon size={ICON_SIZE} />
                        </Button>
                        <Button className={classes.windowBtn} title={getLang('MAXIMIZE', lang)}
                            disableRipple disableFocusRipple>
                            <MaximizeIcon size={ICON_SIZE} />
                        </Button>
                        <Button className={classes.windowBtn} title={getLang('CLOSE', lang)}
                            disableRipple disableFocusRipple>
                            <CloseIcon size={ICON_SIZE} />
                        </Button>
                    </React.Fragment>
                ) : undefined
            }
        </Toolbar>
    );
};