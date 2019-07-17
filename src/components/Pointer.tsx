import React from 'react';
import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { contrast } from '../utils/color';

export interface PointerProps extends React.HTMLAttributes<{}>{
    color?: string;
    left?: string | number;
    hideHead?: boolean;
    headSize?: number;
    headPos?: 'top' | 'bottom';
    label?: string;
    showLabel?: boolean;
    headShape?: 'triangle' | 'circular';
    onCloseLabel?: () => void;
}

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        width: '1px'
    },
    triangle: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        marginLeft: '-0.5px'
    }
});

export default ({ showLabel, onCloseLabel, label, hideHead, headSize, headShape, headPos, color, left, style, ...others }: PointerProps) => {
    const hs = headSize || 10;
    const hp = headPos || 'top';
    const c = color || '#ffc401';
    const s = headShape || 'triangle';
    const l = left || 0;
    const classes = useStyles();
    let rootStyle: React.CSSProperties = {
        backgroundColor: c,
        left: typeof left === 'number' ? `${l}px` : l,
        ...style
    };
    let headStyle: React.CSSProperties = s === 'triangle' ? {
        border: `${hs}px solid transparent`
    } : {
        width: `${hs}px`,
        height: `${hs}px`,
        borderRadius: '50%',
        backgroundColor: 'inherit'
    };
    if (hp === 'top') {
        if (s === 'triangle') {
            headStyle.borderTopColor = c;
        }
        headStyle.top = `-${hs}px`;
        rootStyle.top = hideHead ? 0 : `${hs}px`;
        rootStyle.bottom = 0;
    } else {
        if (s === 'triangle') {
            headStyle.borderBottomColor = c;
        }
        headStyle.bottom = `-${hs}px`;
        rootStyle.bottom = hideHead ? 0 : `${hs}px`;
        rootStyle.top = 0;
    }

    // Force to update tooltip position
    const tooltipStyle: React.CSSProperties = {
        backgroundColor: c,
        color: contrast(c)
    };
    const popoverProps = {
        modifiers: {}
    };
    return (
        <Tooltip open={showLabel} style={tooltipStyle} title={label || ''} placement={hp} PopperProps={popoverProps} onClose={onCloseLabel}>
            <div className={classes.root} style={rootStyle} {...others}>
                {
                    !hideHead ? (<div className={classes.triangle} style={headStyle}></div>) : undefined
                }
            </div>
        </Tooltip>
    );
};