import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
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
    offset?: number;
    theme: Theme;
    stretch?: boolean;
    notPortal?: boolean;
    anchorEl?: HTMLElement|null;
    anchorPos?: PopoverPosition;
    position?: {left: number; top: number};
    transformPos?: PopoverPosition;
    transitionClassNames?: string | Dictionary<string>;
    onClose?: (...args: any[]) => void;
}

export default withTheme(React.forwardRef(({
    visible, anchorEl, anchorPos, transformPos, stretch, position, offset,
    onClose, transitionClassNames, children, theme, notPortal, ...others
}: React.PropsWithChildren<PopoverProps>, ref: React.Ref<any>) => {
    const [show, setShow] = useState(false);
    const [transitionActive, setTransitionActive] = useState(false);
    const [transitionEnded, setTransitionEnded] = useState(false);
    const o = offset || 8;
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

    const wrapperRef = (ref as React.RefObject<HTMLDivElement>) || useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    useClickOutside(wrapperRef.current, onClickOutSide);
    const [pos, setPos] = useState({ left: 0, top: 0 });
    const pageSize = useResize(null);
    const afterExit = () => {
        setTransitionEnded(true);
    };

    const [bounds, setBounds] = useState({ left: 0, right: 0, width: 0, top: 0, bottom: 0, height: 0 });
    useLayoutEffect(() => {
        anchorEl && setBounds(anchorEl.getBoundingClientRect());
    }, [anchorEl]);
    const beforeEnter = () => {
        anchorEl && setBounds(anchorEl.getBoundingClientRect());
    };

    const updater = useCallback(() => {
        if (anchorEl && popoverRef.current && transitionActive) {
            const wBounds = popoverRef.current.getBoundingClientRect();
            let newPos = { left: 0, top: 0 };
            if (position) {
                newPos.left = position.left;
            } else if (ap.horizontal === 'left') {
                newPos.left = bounds.left;
            } else if (ap.horizontal === 'right') {
                newPos.left = bounds.right;
            } else {
                newPos.left = bounds.left + bounds.width * 0.5;
            }

            if (tp.horizontal === 'center') {
                if (stretch) {
                    newPos.left -= bounds.width * 0.5;
                } else {
                    newPos.left -= wBounds.width * 0.5;
                }
            } else if (tp.horizontal === 'right') {
                if (stretch) {
                    newPos.left -= bounds.width;
                } else {
                    newPos.left -= wBounds.width;
                }
            }

            if (newPos.left + wBounds.width + o >= pageSize.width) {
                if (position) {
                    newPos.left = position.left - wBounds.width - o;
                } else if (bounds.right - wBounds.width <= pageSize.width) {
                    newPos.left = bounds.right - wBounds.width;
                } else {
                    newPos.left = bounds.left - wBounds.width - o;
                }
            } else if (newPos.left - o < 0) {
                if (position) {
                    newPos.left = position.left + o;
                } else if (bounds.left >= 0) {
                    newPos.left = bounds.left;
                } else {
                    newPos.left = bounds.right + o;
                }
            }

            if (position) {
                newPos.top = position.top;
            } else if (ap.vertical === 'top') {
                newPos.top = bounds.top;
            } else if (ap.vertical === 'bottom') {
                newPos.top = bounds.bottom;
            } else {
                newPos.top = bounds.top + bounds.height * 0.5;
            }

            if (tp.vertical === 'middle') {
                newPos.top -= wBounds.height * 0.5;
            } else if (tp.vertical === 'bottom') {
                newPos.top -= wBounds.height;
            }

            if (newPos.top + wBounds.height + o > pageSize.height) {
                if (position) {
                    newPos.top = position.top - wBounds.height - o;
                } else if (bounds.bottom - wBounds.height <= pageSize.height) {
                    newPos.top = bounds.bottom - wBounds.height;
                } else {
                    newPos.top = bounds.top - wBounds.height - o;
                }
            } else if (newPos.top < 0) {
                if (position) {
                    newPos.top = position.top + o;
                } else if (bounds.top >= 0) {
                    newPos.top = bounds.top;
                } else {
                    newPos.top = bounds.bottom + o;
                }
            }

            if (position) {
                if (position.left <= newPos.left) {
                    newPos.left += o;
                } else if (position.left > newPos.left) {
                    newPos.left -= o;
                }

                if (position.top <= newPos.top) {
                    newPos.top += o;
                } else if (position.top > newPos.top) {
                    newPos.top -= o;
                }
            } else {
                if (newPos.left >= bounds.right) {
                    newPos.left += o;
                } else if (newPos.left + wBounds.width <= bounds.left) {
                    newPos.left -= o;
                }

                if (newPos.top >= bounds.bottom) {
                    newPos.top += o;
                } else if (newPos.top + wBounds.height <= bounds.top) {
                    newPos.top -= o;
                }
            }
            setPos(newPos);
        }
    }, [popoverRef.current, anchorEl, ap, tp, stretch, transitionActive, pageSize, position, bounds, o]);
    useEffect(updater, [updater]);

    let popoverContainerStyle: React.CSSProperties = {
        display: show ? 'block' : 'none',
        left: `${pos.left}px`,
        top: `${pos.top}px`
    };

    if (stretch && anchorEl) {
        popoverContainerStyle.minWidth = `${anchorEl.offsetWidth}px`;
    }
    const content = <div ref={wrapperRef}
        css={{ ...popoverContainerStyles(theme) }} style={popoverContainerStyle}>
        <CSSTransition timeout={300} unmountOnExit classNames={transitionClassNames || 'scale'} in={transitionActive}
            onEnter={beforeEnter}
            onExited={afterExit}>
            <div ref={popoverRef} className="popover" {...others}>
                {children}
            </div>
        </CSSTransition>
    </div>;
    if (notPortal) return content;
    else return createPortal(content, document.body);
}));