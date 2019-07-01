import React, { useRef, useCallback } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import useFrameSelection from '../../hooks/useFrameSelection';
import clientRectToAABB from '../../utils/clientRectToAABB';
import useUpdateEffect from '../../hooks/useUpdateEffect';

const frameSelectionStyles = (theme: Theme): any => {
    return {
        position: 'absolute',
        backgroundColor: theme.components.frameSelection.backgroundColor,
        border: `1px solid ${theme.components.frameSelection.borderColor}`
    };
};

export interface FrameSelectionProps extends React.HTMLAttributes<{}>{
    collection?: HTMLCollection | NodeListOf<HTMLElement>|null;
    dataset?: boolean;
    onSelectedChange?: (v: Dictionary<string>) => void;
}

export default React.forwardRef(({ collection, dataset, children, onSelectedChange, onMouseDown, ...others }: React.PropsWithChildren<FrameSelectionProps>, ref: React.Ref<HTMLElement>) => {
    const refObj = ref as React.RefObject<HTMLDivElement>;
    const containerDOM = refObj || useRef<HTMLDivElement>(null);
    const containerBounds = containerDOM.current ? clientRectToAABB(containerDOM.current.getBoundingClientRect()) : { x: 0, y: 0, width: 0, height: 0 };
    const selection = useFrameSelection(collection || null, dataset);
    const selected = selection.selected;
    const bounds = selection.bounds;
    const active = selection.active;
    const onSelectedChangeMemo = useCallback(() => onSelectedChange && onSelectedChange(selected), [selected, onSelectedChange]);
    useUpdateEffect(onSelectedChangeMemo);
    const onMouseDownWrapper = (e) => {
        selection.onMouseDown(e);
        onMouseDown && onMouseDown(e);
    };
    const selectionStyle = {
        display: active ? 'block' : 'none',
        left: `${bounds.x - containerBounds.x + (containerDOM.current ? containerDOM.current.scrollLeft : 0)}px`,
        top: `${bounds.y - containerBounds.y + (containerDOM.current ? containerDOM.current.scrollTop : 0)}px`,
        width: `${bounds.width}px`,
        height: `${bounds.height}px`
    };
    return (
        <div ref={containerDOM} style={{ position: 'relative' }} {...others} onMouseDown={onMouseDownWrapper}>
            {children}
            <div draggable={false} css={frameSelectionStyles} onDragStart={() => false} style={selectionStyle}></div>
        </div>
    );
});