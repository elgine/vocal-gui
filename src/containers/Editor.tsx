import React from 'react';
import { makeStyles, Theme, withTheme } from '@material-ui/core/styles';
import combineClassNames from '../utils/combineClassNames';
import PlayerControls from './PlayerControls';
import TimelinePanel from './TimelinePanel';
import ControlBar from './ControlBar';
import scrollBar from '../components/mixins/scrollBar';
import { fade } from '../utils/color';

const CONTROL_BAR_HEIGHT = 64;
const PLAYER_CONTROLS_HEIGHT = 64;

const useStyles = (theme: Theme) => {
    const contrastC = theme.palette.getContrastText(theme.palette.background.default);
    return makeStyles({
        '@global': {
            ...scrollBar({
                width: 12,
                trackBgColor: fade(contrastC, 0.04),
                thumbBgColor: fade(contrastC, 0.08),
                thumbBgColorHover: fade(contrastC, 0.12),
                thumbBgColorActive: fade(contrastC, 0.21)
            })
        },
        root: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        controlBar: {
            height: `${CONTROL_BAR_HEIGHT}px`
        },
        playerControls: {
            height: `${PLAYER_CONTROLS_HEIGHT}px`
        },
        timelinePanel: {
            flex: 1
        }
    });
};

export interface EditorProps extends React.HTMLAttributes<{}>{

}

export default withTheme(({ theme, className, ...others }: EditorProps & {theme: Theme}) => {
    const classes = useStyles(theme)();
    const controlBarStyle: React.CSSProperties = {
        height: `${CONTROL_BAR_HEIGHT}px`
    };
    return (
        <div className={combineClassNames(
            classes.root,
            className
        )} {...others}>
            <ControlBar className={classes.controlBar} />
            <TimelinePanel className={classes.timelinePanel} />
            <PlayerControls className={classes.playerControls} />
        </div>
    );
});