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
import { getLang, LangContext } from '../lang';
import { Keyboard, Comment, Help } from '@material-ui/icons';
import { MenuItemProps } from '@material-ui/core/MenuItem';
import { useSelector } from 'react-redux';
import { HotkeysState } from '../store/models/hotkeys/types';
import { FabProps } from '@material-ui/core/Fab';
import { StateWithHistory } from 'redux-undo';

const HotkeyMenuItem = ({ onClick, ...others }: Omit<MenuItemProps, 'button'>) => {
    const lang = useContext(LangContext);
    const mapStateToProps = useCallback(({ present }: StateWithHistory<{hotkeys: HotkeysState}>) => {
        const { actionHotkeyMap, hotkeyActionMap } = present.hotkeys;
        return Object.values(actionHotkeyMap).map((hid) => hotkeyActionMap[hid]);
    }, []);
    const actionHotkeys = useSelector(mapStateToProps);
    const [openHotkeyDialog, setOpenHotkeyDialog] = useState(false);
    const onMenuItemClick = (e: React.MouseEvent<Element>) => {
        setOpenHotkeyDialog(true);
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
            <Dialog fullWidth maxWidth="sm" open={openHotkeyDialog} onClose={() => setOpenHotkeyDialog(false)}>
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

export interface HelpButtonProps extends Omit<FabProps, 'onClick'>{
    open?: boolean;
}

export default ({ open, ...others }: HelpButtonProps) => {
    const lang = useContext(LangContext);
    const [openHelpMenu, setOpenHelpMenu] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
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
                onClose={() => setOpenHelpMenu(false)}>
                <MenuItem>
                    <Comment />
                    &nbsp;
                    {
                        getLang('GUIDE', lang)
                    }
                </MenuItem>
                <HotkeyMenuItem />
            </Menu>
        </React.Fragment>
    );
};