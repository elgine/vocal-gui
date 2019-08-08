import React, { useRef, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../store';
import { TextField, Toolbar, Button } from '@material-ui/core';
import Placeholder from './Placeholder';
import { getLang } from '../lang';

const mapLocaleStateToProps = ({ present }: RootState) => {
    return {
        ...present.locale
    };
};

export interface DirectorySelectorProps{
    value?: string;
    onChange?: (v: string) => void;
}

export default ({ value, onChange }: DirectorySelectorProps) => {
    const { lang } = useSelector(mapLocaleStateToProps, shallowEqual);
    const inputRef = useRef<HTMLInputElement>(null);
    const onBrowseClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
    const onPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        onChange && onChange(file.path);
    };
    useEffect(() => {
        if (inputRef.current) {
            const input = inputRef.current;
            input.setAttribute('webkitdirectory', '');
            input.setAttribute('directory', '');
        }
    }, []);
    return (
        <Toolbar style={{ width: '100%' }} variant="dense" disableGutters>
            <Placeholder>
                <TextField value={value} fullWidth disabled placeholder={getLang('CHOOSE_DIRECTORY', lang)} />
            </Placeholder>
            <Button variant="contained" onClick={onBrowseClick}>
                {
                    getLang('BROWSE', lang)
                }
            </Button>
            <input hidden type="file" ref={inputRef} onChange={onPathChange} />
        </Toolbar>
    );
};