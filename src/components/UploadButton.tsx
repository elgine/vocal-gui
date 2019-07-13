import React, { useRef } from 'react';
import { Button } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';

export interface UploadButtonProps extends Omit<ButtonProps, 'onChange'>{
    multiple?: boolean;
    accept?: string;
    onChange?: (v: FileList) => void;
}

export default ({ onClick, multiple, accept, children, onChange, ...others }: UploadButtonProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const onBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        inputRef.current && inputRef.current.click();
        onClick && onClick(e);
    };
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.files && onChange && onChange(e.target.files);
    };
    return (
        <Button variant="contained" onClick={onBtnClick} {...others}>
            {children}
            <input ref={inputRef} hidden type="file" multiple={multiple}
                accept={accept} onChange={onInputChange}
            />
        </Button>
    );
};