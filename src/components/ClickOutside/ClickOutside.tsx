import React, { useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';

export interface ClickOutsideProps extends React.HTMLAttributes<{}>{
    event?: 'click'|'mouseup'|'mousedown';
    onClickOutside?: (e: MouseEvent) => void;
}

export default ({ event, onClickOutside, children, ...others }: React.PropsWithChildren<ClickOutsideProps>) => {
    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref.current, onClickOutside, event);
    return (
        <div ref={ref} {...others}>
            {children}
        </div>
    );
};