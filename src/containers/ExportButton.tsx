import React, { useState, useContext, useRef } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, Typography, Tooltip, Badge } from '@material-ui/core';
import NewExportTaskButton from './NewExportTaskButton';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../store';
import { SaveAlt, QueueMusic } from '@material-ui/icons';
import { getLang } from '../lang';
import ExportListButton from './ExportListButton';

const ExportIcon = () => {
    return (
        <svg version="1.1" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,1L8,5H11V14H13V5H16M18,23H6C4.89,23 4,22.1 4,21V9A2,2 0 0,1 6,7H9V9H6V21H18V9H15V7H18A2,2 0 0,1 20,9V21A2,2 0 0,1 18,23Z" />
        </svg>
    );
};

const mapStateToProps = ({ present }: RootState) => {
    return {
        disabledExport: present.editor.source === undefined,
        taskCount: Object.values(present.render.tasks).filter((t) => t.state >= 0 && t.state < 1).length,
        lang: present.locale.lang
    };
};

export default React.forwardRef((props, ref: React.Ref<any>) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { disabledExport, taskCount, lang } = useSelector(mapStateToProps, shallowEqual);
    const [openMenu, setOpenMenu] = useState(false);
    const onMenuItemClose = () => setOpenMenu(false);
    return (
        <React.Fragment>
            <Tooltip title={getLang('EXPORT', lang)}>
                <IconButton ref={buttonRef} onClick={() => setOpenMenu(true)}>
                    {taskCount > 0 ? (
                        <Badge badgeContent={taskCount} color="secondary">
                            <ExportIcon />
                        </Badge>
                    ) : <ExportIcon />}
                </IconButton>
            </Tooltip>
            <Menu open={openMenu} anchorEl={buttonRef.current} onClose={() => setOpenMenu(false)}>
                <NewExportTaskButton Component={MenuItem} ComponentProps={{
                    disabled: disabledExport,
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
});