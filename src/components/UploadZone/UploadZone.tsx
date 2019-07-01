import React, { useRef } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import verticalAlign from '../mixins/verticalAlign';
import { FiInfo } from 'react-icons/fi';

const uploadZoneStyles = (theme: Theme): any => {
    return {
        boxSizing: 'border-box',
        border: `1px dashed ${theme.palette.border.border}`,
        textAlign: 'center',
        ...verticalAlign(),
        '&:after': {
            position: 'absolute',
            content: '""',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0
        },
        '.upload-illustration': {
            color: theme.palette.border.border
        },
        '&:hover, &.drag-over': {
            borderColor: theme.palette.primary.color,
            color: theme.palette.primary.color
        }
    };
};

export interface UploadZoneProps extends Omit<React.HTMLAttributes<{}>, 'onClick' | 'title'>{
    desc?: React.ReactNode;
    accept?: string;
    onUpload?: (v: FileList) => void;
}

export default ({ desc, accept, onUpload, onDragEnter, onDragOver, onDragLeave, onDrop, ...others }: UploadZoneProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.files && onUpload && onUpload(e.target.files);
    };
    const stopDragDefaultBehaviour = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const onDragEnterWrapped = (e: React.DragEvent) => {
        stopDragDefaultBehaviour(e);
        (e.target as HTMLElement).classList.add('drag-over');
        onDragEnter && onDragEnter(e);
    };
    const onDragOverWrapped = (e: React.DragEvent) => {
        stopDragDefaultBehaviour(e);
        onDragOver && onDragOver(e);
    };
    const onDragLeaveWrapped = (e: React.DragEvent) => {
        stopDragDefaultBehaviour(e);
        (e.target as HTMLElement).classList.remove('drag-over');
        onDragLeave && onDragLeave(e);
    };
    const onDropWrapped = (e: React.DragEvent) => {
        stopDragDefaultBehaviour(e);
        (e.target as HTMLElement).classList.remove('drag-over');
        if (e.dataTransfer.files) {
            onUpload && onUpload(e.dataTransfer.files);
        }
        onDrop && onDrop(e);
    };
    const onClick = () => inputRef.current && inputRef.current.click();
    return (
        <div css={uploadZoneStyles}
            onClick={onClick}
            onDragEnter={onDragEnterWrapped}
            onDragOver={onDragOverWrapped}
            onDragLeave={onDragLeaveWrapped}
            onDrop={onDropWrapped}
            {...others}>
            {
                desc || (
                    <React.Fragment>
                        <FiInfo size="1.1rem" />
                        &nbsp;
                        <span>Drag files here</span>
                    </React.Fragment>
                )
            }
            <input hidden ref={inputRef} style={{ display: 'none' }} accept={accept} type="file" multiple onChange={onInputChange} />
        </div>
    );
};