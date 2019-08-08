import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { LibraryMusicOutlined } from '@material-ui/icons';
import { getLang } from '../lang';
import LoadButton from './LoadButton';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../store';
import { IconButtonProps } from '@material-ui/core/IconButton';

const mapLocaleStateToProps = ({ present }: RootState) => {
    return {
        ...present.locale
    };
};

const LoadButtonWrappedTooltip = React.forwardRef((props: IconButtonProps, ref: React.Ref<any>) => {
    const { lang } = useSelector(mapLocaleStateToProps, shallowEqual);
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
        disabledExport: present.editor.source === undefined
    };
};

export default React.memo(() => {
    return (
        <LoadButton Component={LoadButtonWrappedTooltip} />
    );
}, () => true);