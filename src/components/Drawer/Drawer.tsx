import React, { useEffect, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import useClickOutside from '../../hooks/useClickOutside';

const drawerStyles = (theme: Theme): any => {
    return {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        boxShadow: theme.depth.level[4],
        zIndex: theme.depth.zIndex['drawer'],
        '.drawer-mask': {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundColor: theme.palette.mask.dark
        },
        '.drawer-content': {
            position: 'absolute',
            backgroundColor: theme.palette.background.surface,
        }
    };
};

export interface DrawerProps extends React.HTMLAttributes<{}>{
    visible?: boolean;
    mask?: boolean;
    direction?: 'left'|'right'|'top'|'bottom';
    width?: number;
    onClose?: Function;
}

export default ({ visible, width, direction, children, style, onClose, ...others }: React.PropsWithChildren<DrawerProps>) => {
    const w = width || 220;
    const d = direction || 'left';
    let combinedStyle: React.CSSProperties = {
        [d]: '0',
        ...style
    };
    if (direction === 'left' || direction === 'right') {
        combinedStyle.top = '0';
        combinedStyle.width = `${w}px`;
        combinedStyle.height = '100%';
    } else {
        combinedStyle.left = '0';
        combinedStyle.width = '100%';
        combinedStyle.height = `${w}px`;
    }

    const [show, setShow] = useState(false);
    const [transitionActive, setTransitionActive] = useState(false);
    const [transitionEnded, setTransitionEnded] = useState(false);
    useEffect(() => {
        if (visible) {
            setTransitionEnded(false);
            setShow(true);
        }
        if (!visible && transitionEnded) {
            setShow(false);
        }
        setTransitionActive(visible || false);
    }, [visible, transitionEnded]);

    const onClickOutSide = (e: MouseEvent) => onClose && onClose();

    const contentRef = useRef<HTMLDivElement>(null);
    useClickOutside(contentRef.current, onClickOutSide, 'click');

    const wrapperStyle: React.CSSProperties = {
        display: show ? 'block' : 'none'
    };
    return (
        <div css={drawerStyles} style={wrapperStyle}>
            <CSSTransition classNames="fade" in={transitionActive} timeout={300} unmountOnExit>
                <div className="drawer-mask"></div>
            </CSSTransition>
            <CSSTransition classNames="slide" in={transitionActive} timeout={300} unmountOnExit>
                <div ref={contentRef} className="drawer-content" style={combinedStyle} {...others}>
                    {children}
                </div>
            </CSSTransition>
        </div>
    );
};