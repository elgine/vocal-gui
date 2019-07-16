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

export interface LoadMethodPanelProps extends Omit<MenuProps, 'onClose'>{
    onTrigger?: (type: SourceType, ...args: any[]) => void;
    onClose?: Function;
}

export const LoadMethodPanel = ({ onTrigger, onClose, ...others }: LoadMethodPanelProps) => {
    const lang = useContext(LangContext);
    const [url, setUrl] = useState('');
    const [showUrlDialog, setShowUrlDialog] = useState(false);
    const onUrlBtnClick = () => {
        setShowUrlDialog(true);
    };
    const onTriggerWrapped = (type: SourceType, ...args: any[]) => {
        onTrigger && onTrigger(type, ...args);
        setShowUrlDialog(false);
        onClose && onClose();
    };
    const onMicBtnClcik = () => onTriggerWrapped('MIC');
    const onLocalFileListChange = (v: FileList) => onTriggerWrapped('LOCAL', v[0]);
    const onLinkDialogCommit = () => onTriggerWrapped('URL', url);
    return (
        <React.Fragment>
            <Menu anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
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
    return (
        <Dialog onClose={onClose} {...others}>
            <DialogTitle>{getLang('SOURCE_URL', lang)}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {
                        getLang('ENTER_URL_DESC', lang)
                    }
                </DialogContentText>
                <TextField value={url} placeholder={getLang('SOURCE_URL', lang)}
                    onChange={(e) => onUrlChange && onUrlChange(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {getLang('CANCEL', lang)}
                </Button>
                <Button onClick={onConfirm} color="primary">
                    {getLang('CONFIRM', lang)}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export interface LoadButtonProps extends ButtonProps{
    onTrigger?: (type: SourceType, val?: File | string) => void;
}

export default ({ onTrigger, children, ...others }: LoadButtonProps) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [showMethodPanel, setShowMethodPanel] = useState(false);
    return (
        <Button ref={btnRef} onClick={() => setShowMethodPanel(true)} {...others}>
            {children}
            <LoadMethodPanel anchorEl={btnRef.current}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={showMethodPanel} onClose={() => setShowMethodPanel(false)}
            />
        </Button>
    );
};