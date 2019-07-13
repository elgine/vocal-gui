import React, { useMemo } from 'react';
import { withTheme, makeStyles, Theme } from '@material-ui/core/styles';
import combineClassNames from '../utils/combineClassNames';
import { contrast, fade } from '../utils/color';

const useStyles = (theme: Theme, scrollBarWidth: string = '0.4rem') => {
    return makeStyles({
        root: {
            position: 'relative',
            '& .scroll-box': {
                overflowY: 'scroll',
                '&::-webkit-scrollbar': {
                    width: scrollBarWidth
                },
                '&::-webkit-scrollbar, &::-webkit-scrollbar-thumb': {
                    overflow: 'visible',
                    borderRadius: `${theme.shape.borderRadius}px`
                },
                '&::-webkit-scrollbar-thumb': {
                    background: fade(contrast(theme.palette.background.default), 0.2)
                }
            },
            '& .cover-bar': {
                position: 'absolute',
                background: theme.palette.common[theme.palette.type === 'dark' ? 'black' : 'white'],
                height: '100%',
                top: 0,
                right: 0,
                width: scrollBarWidth,
                transition: 'all 0.5s',
                opacity: 1
            },
            '&:hover .cover-bar': {
                opacity: 0
            }
        }
    });
};

export interface FadedScrollBarContainerProps extends React.HTMLAttributes<{}>{
    scrollBarWidth?: string;
    height?: number|string;
}

export default withTheme(({ theme, height, className, scrollBarWidth, children, ...others }: FadedScrollBarContainerProps & {theme: Theme}) => {
    const classes = useMemo(() => useStyles(theme, scrollBarWidth)(), [theme]);
    return (
        <div className={
            combineClassNames(
                classes.root,
                className
            )
        } {...others}>
            <div className="scroll-box" style={{ height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto' }}>
                {children}
            </div>
            <div className="cover-bar"></div>
        </div>
    );
});