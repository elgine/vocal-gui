import React, { useContext, useRef, useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip, ListItemIcon, Typography } from '@material-ui/core';
import { LibraryMusicOutlined, MusicVideo, SaveAlt, QueueMusic } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';
import LoadButton from './LoadButton';
import ExportButton from './ExportButton';
import ExportListButton from './ExportListButton';

export default () => {
    const lang = useContext(LangContext);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [openMenu, setOpenMenu] = useState(false);
    const onMenuItemClose = () => {
        setOpenMenu(false);
    };
    return (
        <React.Fragment>
            <Tooltip title={getLang('AUDIO_FILE', lang)}>
                <IconButton ref={buttonRef} onClick={() => setOpenMenu(true)}>
                    <LibraryMusicOutlined />
                </IconButton>
            </Tooltip>
            <Menu open={openMenu} anchorEl={buttonRef.current} onClose={() => setOpenMenu(false)}>
                <LoadButton Component={MenuItem} ComponentProps={{
                    children: (
                        <React.Fragment>
                            <ListItemIcon>
                                <MusicVideo />
                            </ListItemIcon>
                            <Typography variant="inherit">
                                {getLang('LOAD_SOURCE', lang)}
                            </Typography>
                        </React.Fragment>
                    )
                }} onClose={onMenuItemClose}
                />
                <ExportButton Component={MenuItem} ComponentProps={{
                    children: (
                        <React.Fragment>
                            <ListItemIcon>
                                <SaveAlt />
                            </ListItemIcon>
                            <Typography variant="inherit">
                                {
                                    getLang('EXPORT', lang)
                                }
                            </Typography>
                        </React.Fragment>
                    )
                }} onClose={onMenuItemClose}
                />
                <ExportListButton Component={MenuItem} ComponentProps={{
                    children: (
                        <React.Fragment>
                            <ListItemIcon>
                                <QueueMusic />
                            </ListItemIcon>
                            <Typography>
                                {
                                    getLang('EXPORT_LIST', lang)
                                }
                            </Typography>
                        </React.Fragment>
                    )
                }} onClose={onMenuItemClose}
                />
            </Menu>
        </React.Fragment>
    );
};