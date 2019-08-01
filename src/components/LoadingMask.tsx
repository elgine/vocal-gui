import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, CircularProgress } from '@material-ui/core';
import { fade, contrast } from '../utils/color';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => {
    return {
        root: {
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: fade(contrast(theme.palette.text.primary), 0.7)
        },
        progress: {
            position: 'absolute',
            top: '50%',
            left: '50%'
        }
    };
});

export interface LoadingMaskProps extends React.HTMLAttributes<{}>{
    progressSize?: number;
}

export default ({ progressSize, className, ...others }: LoadingMaskProps) => {
    const classes = useStyles();
    const ps = progressSize || 48;
    return (
        <div className={clsx(classes.root, className)} {...others}>
            <CircularProgress className={classes.progress} size={ps}
                style={{ marginLeft: `-${ps * 0.5}px`, marginTop: `-${ps * 0.5}px` }}
            />
        </div>
    );
};