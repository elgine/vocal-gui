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
    stretch?: boolean;
    anchorEl?: HTMLElement|null;
    anchorPos?: PopoverPosition;
    transformPos?: PopoverPosition;
    transitionClassNames?: string | Dictionary<string>;
    onClose?: (...args: any[]) => void;
}


const applyHorizontalTransformPos = (pos: number, targetBounds: ClientRect, transformPos: 'left'|'center'|'right', stretch: boolean = false, wrapperWidth: number = 0) => {
    if (transformPos === 'center') {
        if (stretch) {
            pos -= wrapperWidth * 0.5;
        } else {
            pos -= targetBounds.width * 0.5;
        }
    } else if (transformPos === 'right') {
        if (stretch) {
            pos -= wrapperWidth;
        } else {
            pos -= targetBounds.width;
        }
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
    visible, anchorEl, anchorPos, transformPos, stretch,
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
    const [bounds, setBounds] = useState({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 });
    const [pos, setPos] = useState({ left: 0, top: 0 });
    const pageSize = useResize(null);
    useEffect(() => {
        anchorEl && setBounds(anchorEl.getBoundingClientRect());
    }, [anchorEl]);
    const beforeEnter = () => {
        if (anchorEl) {
            setBounds(anchorEl.getBoundingClientRect());
        }
    };
    const afterExit = () => {
        setTransitionEnded(true);
    };
    useEffect(() => {
        if (anchorEl && popoverRef.current && transitionActive) {
            const wBounds = popoverRef.current.getBoundingClientRect();
            let newPos = { left: 0, top: 0 };
            if (ap.horizontal === 'left') {
                newPos.left = bounds.left;
            } else if (ap.horizontal === 'right') {
                newPos.left = bounds.right;
            } else {
                newPos.left = bounds.left + bounds.width * 0.5;
            }

            newPos.left = applyHorizontalTransformPos(newPos.left, wBounds, tp.horizontal, stretch, bounds.width);

            if (newPos.left + wBounds.width >= pageSize.width) {
                if (bounds.right - wBounds.width <= pageSize.width) {
                    newPos.left = bounds.right - wBounds.width;
                } else {
                    newPos.left = bounds.left - wBounds.width;
                }
            } else if (newPos.left < 0) {
                if (bounds.left >= 0) {
                    newPos.left = bounds.left;
                } else {
                    newPos.left = bounds.right;
                }
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
                if (bounds.bottom - wBounds.height < -pageSize.height) {
                    newPos.top = bounds.bottom - wBounds.height;
                } else {
                    newPos.top = bounds.top - wBounds.height;
                }
            } else if (newPos.top < 0) {
                if (bounds.top >= 0) {
                    newPos.top = bounds.top;
                } else {
                    newPos.top = bounds.bottom;
                }
            }
            setPos(newPos);
        }
    }, [popoverRef.current, anchorEl, ap, tp, stretch, transitionActive, bounds, pageSize]);

    let popoverContainerStyle: React.CSSProperties = {
        display: show ? 'block' : 'none',
        left: `${pos.left}px`,
        top: `${pos.top}px`
    };

    if (stretch && anchorEl) {
        popoverContainerStyle.minWidth = `${anchorEl.offsetWidth}px`;
    }

    return createPortal(<div ref={wrapperRef} css={{ ...popoverContainerStyles(theme) }} style={popoverContainerStyle}>
        <CSSTransition timeout={300} unmountOnExit classNames={transitionClassNames || 'scale'} in={transitionActive}
            onEnter={beforeEnter}
            onExited={afterExit}>
            <div ref={popoverRef} className="popover" {...others}>
                {children}
            </div>
        </CSSTransition>
    </div>, document.body);
});