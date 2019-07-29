import React, { useContext, useRef, useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip, ListItemIcon, Typography } from '@material-ui/core';
import { LibraryMusicOutlined, MusicVideo, SaveAlt, QueueMusic } from '@material-ui/icons';
import { LangContext, getLang } from '../lang';
import LoadButton from './LoadButton';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../store';
import { IconButtonProps } from '@material-ui/core/IconButton';

const LoadButtonWrappedTooltip = React.forwardRef((props: IconButtonProps, ref: React.Ref<any>) => {
    const lang = useContext(LangContext);
    return (
        <Tooltip title={getLang('LOAD_SOURCE', lang)}>
            <IconButton ref={ref} {...props}>
                <LibraryMusicOutlined />
            </IconButton>
        </Tooltip>
    );
});

const mapStateToProps = ({ present }: RootState) => {
    return {
        disabledExport: present.editor.audioBuffer === undefined
    };
};

export default React.memo(() => {
    return (
        <LoadButton Component={LoadButtonWrappedTooltip} />
    );
}, () => true);