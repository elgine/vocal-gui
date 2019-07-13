import React, { useContext, useRef, useState } from 'react';
import {
    Button, ButtonGroup, Menu, MenuItem, TextField,
    Dialog, DialogActions, DialogContentText, DialogContent, DialogTitle
} from '@material-ui/core';
import { ButtonGroupProps } from '@material-ui/core/ButtonGroup';
import { ArrowDropDown, CloudUpload, Link, Mic } from '@material-ui/icons';
import UploadButton from './UploadButton';
import { getLang, LangContext } from '../lang';
import { SUPPORT_MIME } from '../constant';

export enum SourceType{
    LOCAL = 'local',
    URL = 'url',
    MIC = 'mic'
}

export interface LoadButtonProps extends ButtonGroupProps{
    onTrigger?: (type: SourceType, val?: File | string) => void;
}

export default ({ onTrigger }: LoadButtonProps) => {
    const lang = useContext(LangContext);
    const dropdownBtnRef = useRef<HTMLButtonElement>(null);
    const [showOtherWays, setShowOtherWays] = useState(false);
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [url, setUrl] = useState('');
    const onClickLink = () => setShowLinkDialog(true);
    const onClickMic = () => onTrigger && onTrigger(SourceType.MIC);
    const onLinkDialogCommit = () => onTrigger && onTrigger(SourceType.URL, url);
    const onUpload = (fl: FileList) => onTrigger && onTrigger(SourceType.LOCAL, fl[0]);
    return (
        <React.Fragment>
            <ButtonGroup color="primary" variant="outlined">
                <UploadButton accept={SUPPORT_MIME} onChange={onUpload}>
                    <CloudUpload fontSize="small" />
                    &nbsp;
                    {
                        getLang('LOAD_FROM_LOCAL', lang)
                    }
                </UploadButton>
                <Button ref={dropdownBtnRef} onClick={() => setShowOtherWays(true)}>
                    <ArrowDropDown />
                </Button>
            </ButtonGroup>
            <Menu open={showOtherWays} onClose={() => setShowOtherWays(false)}
                anchorEl={dropdownBtnRef.current}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}>
                <MenuItem onClick={onClickLink}>
                    <Link fontSize="small" />
                    &nbsp;
                    {
                        getLang('LOAD_FROM_URL', lang)
                    }
                </MenuItem>
                <MenuItem onClick={onClickMic}>
                    <Mic fontSize="small" />
                    &nbsp;
                    {
                        getLang('LOAD_FROM_MIC', lang)
                    }
                </MenuItem>
            </Menu>
            <Dialog open={showLinkDialog} onClose={() => setShowLinkDialog(false)}>
                <DialogTitle>{getLang('SOURCE_URL', lang)}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {
                            getLang('ENTER_URL_DESC', lang)
                        }
                    </DialogContentText>
                    <TextField value={url} placeholder={getLang('SOURCE_URL', lang)}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowLinkDialog(false)}>
                        {getLang('CANCEL', lang)}
                    </Button>
                    <Button onClick={onLinkDialogCommit} color="primary">
                        {getLang('CONFIRM', lang)}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};