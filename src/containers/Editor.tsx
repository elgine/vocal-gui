import React from 'react';
import { makeStyles, Theme, withTheme } from '@material-ui/core/styles';
import combineClassNames from '../utils/combineClassNames';
import PlayerControls from './PlayerControls';
import TimelinePanel from './TimelinePanel';
import scrollBar from '../components/mixins/scrollBar';
import { fade } from '../utils/color';

const PLAYER_CONTROLS_HEIGHT = 64;

const useStyles = makeStyles((theme: Theme) => {
    const contrastC = theme.palette.getContrastText(theme.palette.background.default);
    return {
        '@global': {
            ...scrollBar({
                width: 12,
                trackBgColor: fade(contrastC, 0.02),
                thumbBgColor: fade(contrastC, 0.08),
                thumbBgColorHover: fade(contrastC, 0.12),
                thumbBgColorActive: fade(contrastC, 0.21)
            })
        },
        root: {
            position: 'relative',
            boxSizing: 'border-box',
            paddingBottom: `${PLAYER_CONTROLS_HEIGHT}px`,
            height: '100%'
        },
        playerControls: {
            height: `${PLAYER_CONTROLS_HEIGHT}px`
        }
    };
});

export interface EditorProps extends React.HTMLAttributes<{}>{

}

export default withTheme(({ theme, className, ...others }: EditorProps & {theme: Theme}) => {
    const classes = useStyles(theme);
    return (
        <div className={combineClassNames(
            classes.root,
            className
        )} {...others}>
            <TimelinePanel />
            <PlayerControls className={classes.playerControls} />
        </div>
    );
});