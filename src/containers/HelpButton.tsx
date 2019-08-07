import React, { useContext, useState, useRef, useCallback } from 'react';
import keycode from 'keycode';
import {
    Tooltip,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    ButtonGroup,
    Button,
    DialogActions,
    Fab,
    Zoom
} from '@material-ui/core';
import { RematchDispatch } from '@rematch/core';
import { getLang, languages, LangContext } from '../lang';
import { Keyboard, Comment, Help, Language } from '@material-ui/icons';
import { MenuItemProps } from '@material-ui/core/MenuItem';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { FabProps } from '@material-ui/core/Fab';
import { RootState } from '../store';
import { ACTION_SWITCH_LANG } from '../store/models/locale/types';

const HotkeyMenuItem = ({ onClick, onClose, ...others }: Omit<MenuItemProps, 'button'> & {onClose?: () => void}) => {
    const lang = useContext(LangContext);
    const mapStateToProps = useCallback(({ present }: RootState) => {
        const { actionHotkeyMap, hotkeyActionMap } = present.hotkeys;
        return Object.values(actionHotkeyMap).map((hid) => hotkeyActionMap[hid]);
    }, []);
    const actionHotkeys = useSelector(mapStateToProps);
    const [openHotkeyDialog, setOpenHotkeyDialog] = useState(false);
    const onMenuItemClick = (e: React.MouseEvent<any>) => {
        setOpenHotkeyDialog(true);
        onClick && onClick(e);
    };
    const onDialogClose = () => {
        setOpenHotkeyDialog(false);
        onClose && onClose();
    };
    return (
        <React.Fragment>
            <MenuItem onClick={onMenuItemClick} {...others}>
                <Keyboard />
                &nbsp;
                {
                    getLang('HOTKEY', lang)
                }
            </MenuItem>
            <Dialog fullWidth maxWidth="sm" open={openHotkeyDialog} onClose={onDialogClose}>
                <DialogTitle>
                    {
                        getLang('HOTKEY', lang)
                    }
                </DialogTitle>
                <DialogContent dividers>
                    <List>
                        {
                            actionHotkeys.map(({ action, hotkey, id }) => (
                                <ListItem key={id}>
                                    <ListItemText>
                                        {
                                            getLang(action.title, lang)
                                        }
                                    </ListItemText>
                                    <ListItemSecondaryAction>
                                        <ButtonGroup disabled size="small">
                                            {
                                                hotkey.ctrl ?
                                                    <Button>
                                                        Ctrl
                                                    </Button> : undefined
                                            }
                                            {
                                                hotkey.shift ?
                                                    <Button>
                                                        Shift
                                                    </Button> : undefined
                                            }
                                            {
                                                hotkey.alt ?
                                                    <Button>
                                                        Alt
                                                    </Button> : undefined
                                            }
                                            <Button>
                                                {
                                                    keycode(hotkey.keyCode)
                                                }
                                            </Button>
                                        </ButtonGroup>

                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))
                        }
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenHotkeyDialog(false)}>
                        {
                            getLang('CANCEL', lang)
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

const mapStateToProps = ({ present }: RootState) => {
    return {
        ...present.locale
    };
};

const LocaleMenuItem = () => {
    const langCtx = useContext(LangContext);
    const { lang } = useSelector(mapStateToProps, shallowEqual);
    const dispatch = useDispatch<RematchDispatch>();
    const onLangChange = dispatch.locale[ACTION_SWITCH_LANG];
    const [openLocaleDialog, setOpenLocaleDialog] = useState(false);
    return (
        <React.Fragment>
            <MenuItem onClick={() => setOpenLocaleDialog(true)}>
                <Language />
                &nbsp;
                {
                    getLang('LANGUAGE', langCtx)
                }
            </MenuItem>
            <Dialog open={openLocaleDialog} onClose={() => setOpenLocaleDialog(false)}>
                <DialogTitle>
                    {
                        getLang('SWITCH_LANGUAGE', langCtx)
                    }
                </DialogTitle>
                <List>
                    {
                        languages.map(({ label, value }) => (
                            <ListItem selected={value === lang} button key={value} onClick={() => onLangChange(value)}>
                                {
                                    getLang(label, langCtx)
                                }
                            </ListItem>
                        ))
                    }
                </List>
            </Dialog>
        </React.Fragment>
    );
};

export interface HelpButtonProps extends Omit<FabProps, 'onClick'>{
    open?: boolean;
    onOpenIntro?: () => void;
}

export default ({ open, onOpenIntro, ...others }: HelpButtonProps) => {
    const lang = useContext(LangContext);
    const [openHelpMenu, setOpenHelpMenu] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const onClickIntroMenuItem = () => {
        onOpenIntro && onOpenIntro();
        onClose();
    };
    const onClose = () => {
        setOpenHelpMenu(false);
    };
    return (
        <React.Fragment>
            <Zoom in={open}>
                <Tooltip title={getLang('HELP', lang)}>
                    <Fab ref={buttonRef} onClick={() => setOpenHelpMenu(true)} {...others}>
                        <Help />
                    </Fab>
                </Tooltip>
            </Zoom>
            <Menu anchorEl={buttonRef.current} open={openHelpMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                onClose={onClose}>
                <MenuItem onClick={onClickIntroMenuItem}>
                    <Comment />
                    &nbsp;
                    {
                        getLang('GUIDE', lang)
                    }
                </MenuItem>
                <HotkeyMenuItem onClose={onClose} />
                <LocaleMenuItem />
            </Menu>
        </React.Fragment>
    );
};