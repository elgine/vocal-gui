import React, { useContext, useRef, useState } from 'react';
import {
    Button, Menu, MenuItem, TextField,
    Dialog, DialogActions, DialogContentText, DialogContent, DialogTitle,
    List, ListItemAvatar, ListItemText
} from '@material-ui/core';
import { DialogProps } from '@material-ui/core/Dialog';
import { MenuProps } from '@material-ui/core/Menu';
import { ButtonProps } from '@material-ui/core/Button';
import { CloudUpload, Link, Mic } from '@material-ui/icons';
import { getLang, LangContext } from '../lang';
import { SUPPORT_MIME } from '../constant';
import RecordPanel from './RecordPanel';

export interface UploadedProps extends Omit<React.HtmlHTMLAttributes<{}>, 'onChange'>{
    accept?: string;
    multiple?: boolean;
    onChange?: (v: FileList) => void;
}

export const Uploaded = ({ accept, multiple, children, onChange, ...others }: UploadedProps) => {
    return (
        <label {...others}>
            {children}
            <input type="file" onChange={(e) => e.target.files && onChange && onChange(e.target.files)}
                accept={accept} multiple={multiple} hidden
            />
        </label>
    );
};

export interface LoadMethodPanelProps extends MenuProps{
    onLoadSource?: (v: {type: SourceType; value?: string | File}) => void;
}

export const LoadMethodPanel = ({ onLoadSource, onClose, ...others }: LoadMethodPanelProps) => {
    const lang = useContext(LangContext);
    const [url, setUrl] = useState('');
    const [showUrlDialog, setShowUrlDialog] = useState(false);
    const [showMicDialog, setShowMicDialog] = useState(false);
    const onUrlBtnClick = () => {
        setShowUrlDialog(true);
    };
    const onTrigger = (type: SourceType, value?: string | File) => {
        onLoadSource && onLoadSource({ type, value });
        setShowUrlDialog(false);
        onClose && onClose({}, 'backdropClick');
    };
    const onMicBtnClcik = () => {
        // onTrigger('MIC');
        setShowMicDialog(true);
    };
    const onLocalFileListChange = (v: FileList) => onTrigger('LOCAL', v[0]);
    const onLinkDialogCommit = () => onTrigger('URL', url);
    return (
        <React.Fragment>
            <Menu anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                onClose={onClose}
                {...others}>
                <List>
                    <Uploaded accept={SUPPORT_MIME} onChange={onLocalFileListChange}>
                        <MenuItem button>
                            <ListItemAvatar>
                                <CloudUpload />
                            </ListItemAvatar>
                            <ListItemText primary={getLang('LOAD_FROM_LOCAL', lang)} />
                        </MenuItem>
                    </Uploaded>
                    <MenuItem button onClick={onUrlBtnClick}>
                        <ListItemAvatar>
                            <Link />
                        </ListItemAvatar>
                        <ListItemText primary={getLang('LOAD_FROM_URL', lang)} />
                    </MenuItem>
                    <MenuItem button onClick={onMicBtnClcik}>
                        <ListItemAvatar>
                            <Mic />
                        </ListItemAvatar>
                        <ListItemText primary={getLang('LOAD_FROM_MIC', lang)} />
                    </MenuItem>
                </List>
            </Menu>
            <UrlDialog url={url} onUrlChange={setUrl} open={showUrlDialog} onClose={() => setShowUrlDialog(false)}
                onConfirm={onLinkDialogCommit}
            />
            <Dialog open={showMicDialog} onClose={() => setShowMicDialog(false)}>
                <RecordPanel />
            </Dialog>
        </React.Fragment>
    );
};

export interface UrlDialogProps extends Omit<DialogProps, 'onClose'>{
    url?: string;
    onUrlChange?: (v: string) => void;
    onConfirm?: () => void;
    onClose?: () => void;
}

export const UrlDialog = ({ url, onUrlChange, onConfirm, onClose, ...others }: UrlDialogProps) => {
    const lang = useContext(LangContext);
    const [error, setError] = useState(false);
    const onUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onUrlChange && onUrlChange(val);
        if (/((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g.test(val)) {
            setError(false);
        } else {
            setError(true);
        }
    };
    const onClickConfirm = () => {
        if (error) return;
        onConfirm && onConfirm();
    };
    return (
        <Dialog fullWidth maxWidth="sm" onClose={onClose} {...others}>
            <DialogTitle>{getLang('SOURCE_URL', lang)}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {
                        getLang('ENTER_URL_DESC', lang)
                    }
                </DialogContentText>
                <TextField fullWidth value={url}
                    label="Required"
                    error={error}
                    placeholder={getLang('SOURCE_URL', lang)}
                    onChange={onUrlInputChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {getLang('CANCEL', lang)}
                </Button>
                <Button onClick={onClickConfirm} color="primary">
                    {getLang('CONFIRM', lang)}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export interface LoadButtonProps extends ButtonProps{
    onLoadSource?: (v: {type: SourceType; value?: File | string}) => void;
}

export default ({ onLoadSource, children, ...others }: LoadButtonProps) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [showMethodPanel, setShowMethodPanel] = useState(false);
    return (
        <React.Fragment>
            <Button ref={btnRef} onClick={() => setShowMethodPanel(true)} {...others}>
                {children}
            </Button>
            <LoadMethodPanel anchorEl={btnRef.current}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                onLoadSource={onLoadSource} open={showMethodPanel}
                onClose={() => setShowMethodPanel(false)}
            />
        </React.Fragment>
    );
};