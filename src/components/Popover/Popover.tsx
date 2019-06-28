import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withTheme } from 'emotion-theming';
import { CSSTransition } from 'react-transition-group';
import useResize from '../../hooks/useResize';
import useClickOutside from '../../hooks/useClickOutside';

const popoverContainerStyles = (theme: Theme): any => {
    return {
        position: 'absolute',
        display: 'inline-block',
        '.popover': {
            borderRadius: `${theme.components.common.borderRadius['md']}px`,
            backgroundColor: theme.palette.background.surface,
            boxShadow: theme.depth.level[2],
            zIndex: theme.depth.zIndex['popover']
        }
    };
};

export interface PopoverPosition{
    horizontal: 'left'|'center'|'right';
    vertical: 'top'|'middle'|'bottom';
}

export interface PopoverProps extends BaseComponentProps{
    visible?: boolean;
    theme: Theme;
    anchorEl?: HTMLElement|null;
    anchorPos?: PopoverPosition;
    transformPos?: PopoverPosition;
    transitionClassNames?: string | Dictionary<string>;
    onClose?: (...args: any[]) => void;
}


const applyHorizontalTransformPos = (pos: number, targetBounds: ClientRect, transformPos: 'left'|'center'|'right') => {
    if (transformPos === 'center') {
        pos -= targetBounds.width * 0.5;
    } else if (transformPos === 'right') {
        pos -= targetBounds.width;
    }
    return pos;
};

const applyVerticalTransformPos = (pos: number, targetBounds: ClientRect, transformPos: 'top'|'middle'|'bottom') => {
    if (transformPos === 'middle') {
        pos -= targetBounds.height * 0.5;
    } else if (transformPos === 'bottom') {
        pos -= targetBounds.height;
    }
    return pos;
};

export default withTheme(({
    visible, anchorEl, anchorPos, transformPos,
    onClose, transitionClassNames, children, theme, ...others
}: React.PropsWithChildren<PopoverProps>) => {
    const [show, setShow] = useState(false);
    const [transitionActive, setTransitionActive] = useState(false);
    const [transitionEnded, setTransitionEnded] = useState(false);

    const ap = anchorPos || { horizontal: 'left', vertical: 'top' };
    const tp = transformPos || { horizontal: 'left', vertical: 'top' };

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

    const onClickOutSide = (e: MouseEvent) => {
        if (anchorEl && (anchorEl.contains(e.target as HTMLElement) || anchorEl === e.target)) return;
        onClose && onClose();
    };

    const wrapperRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    useClickOutside(wrapperRef.current, onClickOutSide);
    const [pos, setPos] = useState({ left: 0, top: 0 });
    const pageSize = useResize(null);
    useEffect(() => {
        if (anchorEl && popoverRef.current && transitionActive) {
            const bounds = anchorEl.getBoundingClientRect();
            const wBounds = popoverRef.current.getBoundingClientRect();
            let newPos = { left: 0, top: 0 };
            if (ap.horizontal === 'left') {
                newPos.left = bounds.left;
            } else if (ap.horizontal === 'right') {
                newPos.left = bounds.right;
            } else {
                newPos.left = bounds.left + bounds.width * 0.5;
            }

            newPos.left = applyHorizontalTransformPos(newPos.left, wBounds, tp.horizontal);

            if (newPos.left + wBounds.width >= pageSize.width) {
                newPos.left = bounds.left - wBounds.width;
            } else if (newPos.left < 0) {
                newPos.left = bounds.right;
            }

            if (ap.vertical === 'top') {
                newPos.top = bounds.top;
            } else if (ap.vertical === 'bottom') {
                newPos.top = bounds.bottom;
            } else {
                newPos.top = bounds.top + bounds.height * 0.5;
            }

            newPos.top = applyVerticalTransformPos(newPos.top, wBounds, tp.vertical);

            if (newPos.top + wBounds.height > pageSize.height) {
                newPos.top = bounds.top - wBounds.height;
            } else if (bounds.top - wBounds.height < 0) {
                newPos.top = bounds.bottom;
            }

            setPos(newPos);
        }
    }, [popoverRef.current, anchorEl, ap, tp, transitionActive, pageSize.width, pageSize.height]);

    let popoverContainerStyle: React.CSSProperties = {
        display: show ? 'block' : 'none',
        left: `${pos.left}px`,
        top: `${pos.top}px`
    };

    return createPortal(<div ref={wrapperRef} css={{ ...popoverContainerStyles(theme) }} style={popoverContainerStyle}>
        <CSSTransition timeout={300} unmountOnExit classNames={transitionClassNames || 'scale'} in={transitionActive}
            onExited={() => setTransitionEnded(true)}>
            <div ref={popoverRef} className="popover" {...others}>
                {children}
            </div>
        </CSSTransition>
    </div>, document.body);
});