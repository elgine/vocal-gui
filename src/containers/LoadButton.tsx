import React, { useContext, useRef, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {
    Button, Menu, MenuItem, TextField,
    Dialog, DialogActions, DialogContentText, DialogContent, DialogTitle,
    List, ListItemIcon, ListItemText
} from '@material-ui/core';
import { DialogProps } from '@material-ui/core/Dialog';
import { MenuProps } from '@material-ui/core/Menu';
import { CloudUpload, Link, Mic } from '@material-ui/icons';
import { getLang } from '../lang';
import { SUPPORT_MIME } from '../constant';
import RecordPanel from './RecordPanel';
import { RematchDispatch } from '@rematch/core';
import { ACTION_LOAD_SOURCE } from '../store/models/editor/types';
import { RootState } from '../store';

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
    onLoadSource?: (v: {type: SourceType; value?: string | File | AudioBuffer}) => void;
}

const mapLocaleStateToProps = ({ present }: RootState) => {
    return {
        ...present.locale
    };
};

export const LoadMethodPanel = ({ onLoadSource, ...others }: LoadMethodPanelProps) => {
    const { lang } = useSelector(mapLocaleStateToProps, shallowEqual);
    const [url, setUrl] = useState('');
    const [showUrlDialog, setShowUrlDialog] = useState(false);
    const [showMicDialog, setShowMicDialog] = useState(false);
    const onUrlBtnClick = () => {
        setShowUrlDialog(true);
    };
    const onTrigger = (type: SourceType, value?: string | File | AudioBuffer) => {
        setShowUrlDialog(false);
        setShowMicDialog(false);
        onLoadSource && onLoadSource({ type, value });
    };
    const onMicBtnClcik = () => setShowMicDialog(true);
    const onMicDialogCommit = (v: AudioBuffer) => onTrigger('MIC', v);
    const onLocalFileListChange = (v: FileList) => onTrigger('LOCAL', v[0]);
    const onLinkDialogCommit = () => onTrigger('URL', url);
    return (
        <React.Fragment>
            <Menu anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                {...others}>
                <List>
                    <Uploaded accept={SUPPORT_MIME} onChange={onLocalFileListChange}>
                        <MenuItem button>
                            <ListItemIcon>
                                <CloudUpload />
                            </ListItemIcon>
                            <ListItemText primary={getLang('LOAD_FROM_LOCAL', lang)} />
                        </MenuItem>
                    </Uploaded>
                    <MenuItem button onClick={onUrlBtnClick}>
                        <ListItemIcon>
                            <Link />
                        </ListItemIcon>
                        <ListItemText primary={getLang('LOAD_FROM_URL', lang)} />
                    </MenuItem>
                    <MenuItem button onClick={onMicBtnClcik}>
                        <ListItemIcon>
                            <Mic />
                        </ListItemIcon>
                        <ListItemText primary={getLang('LOAD_FROM_MIC', lang)} />
                    </MenuItem>
                </List>
            </Menu>
            <UrlDialog url={url} onUrlChange={setUrl} open={showUrlDialog} onClose={() => setShowUrlDialog(false)}
                onConfirm={onLinkDialogCommit}
            />
            <RecordPanel open={showMicDialog} onClose={() => setShowMicDialog(false)}
                onConfirm={onMicDialogCommit}
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
    const { lang } = useSelector(mapLocaleStateToProps, shallowEqual);
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

export interface LoadButtonProps{
    Component: React.RefForwardingComponent<any, any>;
    ComponentProps?: any;
    onClose?: () => void;
}

export default React.forwardRef(({ Component, ComponentProps, onClose }: LoadButtonProps, ref: React.Ref<any>) => {
    const dispatch = useDispatch<RematchDispatch>();
    const onLoadSource = dispatch.editor[ACTION_LOAD_SOURCE];
    const rootRef = useRef<any>(null);
    const [showMethodPanel, setShowMethodPanel] = useState(false);
    const onLoadSourceWrapped = (v: any) => {
        setShowMethodPanel(false);
        onLoadSource(v);
        onClose && onClose();
    };
    const onClick = () => {
        setShowMethodPanel(true);
    };
    const onMenuPanleClose = () => {
        setShowMethodPanel(false);
        onClose && onClose();
    };
    return (
        <React.Fragment>
            <Component ref={rootRef} onClick={onClick} {...ComponentProps} />
            <LoadMethodPanel anchorEl={rootRef.current}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                onLoadSource={onLoadSourceWrapped} open={showMethodPanel}
                onClose={onMenuPanleClose}
            />
        </React.Fragment>
    );
});