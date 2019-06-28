import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import verticalAlign from '../mixins/verticalAlign';

const listItemHeaderStyles = css({
    ...verticalAlign()
});

export default React.forwardRef(({ children, ...others }: React.PropsWithChildren<React.HTMLAttributes<{}>>, ref: React.Ref<any>) => {
    return (
        <div ref={ref} css={listItemHeaderStyles} {...others}>
            {children}
        </div>
    );
});