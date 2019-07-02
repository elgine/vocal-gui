import React, { useRef } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import verticalAlign from '../mixins/verticalAlign';
import { MdFileUpload } from 'react-icons/md';
import { fade } from '../utils/color';

const uploadZoneStyles = (theme: Theme): any => {
    return {
        boxSizing: 'border-box',
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
        '&:hover, &.drag-over': {
            backgroundColor: fade(theme.palette.primary.color, 0.2)
        }
    };
};

export interface UploadZoneProps extends Omit<React.HTMLAttributes<{}>, 'onClick' | 'title'>{
    accept?: string;
    onUpload?: (v: FileList) => void;
}

export default ({ accept, onUpload, onDragEnter, onDragOver, onDragLeave, onDrop, children, ...others }: React.PropsWithChildren<UploadZoneProps>) => {
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

            <p><MdFileUpload size={48} /><br /><span>Click to select files or drag files here</span></p>
            <input hidden ref={inputRef} style={{ display: 'none' }}
                accept={accept} type="file" multiple
                onChange={onInputChange}
            />
        </div>
    );
};