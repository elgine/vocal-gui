import React, { useRef, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../store';
import { TextField, Toolbar, Button, Typography } from '@material-ui/core';
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

export default React.forwardRef(({ value, onChange }: DirectorySelectorProps, ref: React.Ref<{}>) => {
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
        onChange && onChange((file as any).path);
    };
    useEffect(() => {
        if (inputRef.current) {
            const input = inputRef.current;
            input.setAttribute('webkitdirectory', '');
            input.setAttribute('directory', '');
        }
    }, []);
    return (
        <Toolbar ref={ref} style={{ width: '100%' }} variant="dense" disableGutters>
            <Placeholder color="text.hint">
                <Typography variant="body1" color="inherit">
                    {value || getLang('CHOOSE_DIRECTORY', lang)}
                </Typography>
            </Placeholder>
            <Button variant="contained" onClick={onBrowseClick}>
                {
                    getLang('BROWSE', lang)
                }
            </Button>
            <input hidden type="file" ref={inputRef} onChange={onPathChange} />
        </Toolbar>
    );
});