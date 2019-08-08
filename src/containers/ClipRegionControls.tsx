import React, { useContext } from 'react';
import { RematchDispatch } from '@rematch/core';
import { Collapse, Box } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import { getLang } from '../lang';
import { ACTION_CLIP_REGION_CHANGE } from '../store/models/editor/types';
import TimeInput from '../components/TimeInput';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RootState, Models } from '../store';

const mapStateToProps = ({ present }: RootState) => {
    return {
        value: present.editor.clipRegion,
        lang: present.locale.lang
    };
};

export default React.memo((props: BoxProps) => {
    const { value, lang } = useSelector(mapStateToProps, shallowEqual);
    const disabled = value[0] === value[1];
    const dispatch = useDispatch<RematchDispatch<Models>>();
    const onChange = dispatch.editor[ACTION_CLIP_REGION_CHANGE];
    return (
        <Collapse in={!disabled} timeout={500}>
            <Box display="inline-flex" alignItems="center" {...props}>
                <TimeInput label={`${getLang('CLIP', lang)}: `} value={value} onChange={onChange}
                    placeholder={[getLang('START_TIME', lang), getLang('END_TIME', lang)]}
                />
            </Box>
        </Collapse>
    );
}, () => true);