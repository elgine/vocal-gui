import React, { useContext } from 'react';
import { IconButton, Tooltip, CircularProgress, Theme } from '@material-ui/core';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { PlayArrow, Stop } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';
import { makeStyles } from '@material-ui/styles';

export interface PlayButtonProps extends Omit<IconButtonProps, 'onChange' | 'value'>{
    value?: boolean;
    loading?: boolean;
    onChange?: (v: boolean) => void;
}

const PROGRESS_SIZE = 40;

const useStyles = makeStyles((theme: Theme) => {
    return {
        root: {
            position: 'relative'
        },
        progress: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: `-${PROGRESS_SIZE * 0.5}px`,
            marginTop: `-${PROGRESS_SIZE * 0.5}px`,
            zIndex: 1
        }
    };
});

export default ({ value, loading, onChange, ...others }: PlayButtonProps) => {
    const classes = useStyles();
    const lang = useContext(LangContext);
    const onClick = (e: React.MouseEvent) => {
        onChange && onChange(!value);
    };
    return (
        <Tooltip title={getLang(value ? 'STOP' : 'START', lang)}>
            <div className={classes.root}>
                <IconButton {...others} onClick={onClick}>
                    {
                        value ? <Stop /> : <PlayArrow />
                    }
                </IconButton>
                {
                    loading ? (
                        <CircularProgress size={PROGRESS_SIZE} className={classes.progress} />
                    ) : undefined
                }
            </div>
        </Tooltip>
    );
};