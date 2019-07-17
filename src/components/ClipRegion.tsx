import React from 'react';
import { Theme, withTheme } from '@material-ui/core/styles';

export interface ClipRegionProps extends React.HTMLAttributes<{}>{
    region?: {start: number; end: number};
    pixelsPerMSec?: number;
}

export default withTheme(({ region, theme, pixelsPerMSec, style, children, ...others }: ClipRegionProps & {theme: Theme}) => {
    const r = region || { start: 0, end: 0 };
    const ppms = pixelsPerMSec || 0.01;
    const primary = theme.palette.primary[theme.palette.type];
    const bg = theme.palette.background.paper;
    const left = r.start * ppms;
    const right = r.end * ppms;
    const combinedStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        background: `linear-gradient(to right, ${bg} ${left}px, ${primary} ${left}px, ${primary} ${right}px, ${bg} ${right}px)`,
        mixBlendMode: 'darken',
        width: '100%',
        ...style
    };
    return (
        <div style={combinedStyle} {...others}>
            {children}
        </div>
    );
});