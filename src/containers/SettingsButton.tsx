import React, { useContext, useState, useRef } from 'react';
import { IconButton, Tooltip, Menu, MenuItem } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { getLang, LangContext } from '../lang';

export default () => {
    const lang = useContext(LangContext);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [openMenuItems, setOpenMenuItems] = useState(false);
    return (
        <React.Fragment>
            <Tooltip title={getLang('SETTINGS', lang)}>
                <IconButton ref={buttonRef} onClick={() => setOpenMenuItems(true)}>
                    <Settings />
                </IconButton>
            </Tooltip>
            <Menu anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorEl={buttonRef.current}
                open={openMenuItems}
                onClose={() => setOpenMenuItems(false)}>
                <MenuItem>
                    {
                        getLang('HOTKEY', lang)
                    }
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
};