import React, { useState, useMemo, useContext, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Tooltip, Toolbar, Grid, Box, Button, Menu, MenuItem, Typography } from '@material-ui/core';
import { GridProps } from '@material-ui/core/Grid';
import { AudiotrackTwoTone, FilterList }  from '@material-ui/icons';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { EFFECTS, EFFECT_LANG_MAP, EffectType, EFFECT_CATEGORY_MAP, EFFECT_CATEGORIES } from '../processor/effectType';
import { getLang, LangContext } from '../lang';
import { fade } from '../utils/color';
import combineClassNames from '../utils/combineClassNames';
import Placeholder from '../components/Placeholder';
import { EMPTY_STRING } from '../constant';
import EffectPropertyPane from './EffectPropertyPane';
import { EffectState, ACTION_SWITCH_EFFECT, ACTION_CHANGE_EFFECT_OPTIONS } from '../store/models/effect/type';
import { getEffectDescriptor } from '../processor/effects/factory';
import { BoxProps } from '@material-ui/core/Box';

interface EffectItemProps extends GridProps{
    title?: string;
    value?: EffectType;
    selected?: boolean;
}

const useStyles = makeStyles((theme: Theme) => {
    const primary = theme.palette.primary.main;
    const faded = fade(primary, 0.12);
    return {
        root: {
            borderRadius: `${theme.shape.borderRadius}px`,
            border: '1px solid transparent',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: faded
            },
            '&:active, &.selected': {
                backgroundColor: faded,
                borderColor: primary
            }
        }
    };
});

const EffectItem = ({ selected, title, className, ...others }: EffectItemProps) => {
    const classes = useStyles();
    return (
        <Grid item className={combineClassNames(classes.root, selected ? 'selected' : '', className)} {...others}>
            <Box textAlign="center" py={1}>
                <AudiotrackTwoTone color="primary" fontSize="large" />
                <Typography variant="subtitle2">
                    {
                        title
                    }
                </Typography>
            </Box>
        </Grid>
    );
};

export interface EffectPanelProps{
    effect: EffectType;
    onEffectChange: (v: EffectType) => void;
    effectOptions: any;
    onEffectOptionsChange: (v: any) => void;
}

const mapStateToProps = (state: {effect: EffectState}) => {
    return {
        ...state.effect
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onEffectChange: dispatch.effect[ACTION_SWITCH_EFFECT],
        onEffectOptionsChange: dispatch.effect[ACTION_CHANGE_EFFECT_OPTIONS]
    };
};

interface PaneProps extends React.HTMLAttributes<{}>{
    header?: React.ReactNode;
    height?: string | number;
}

const TOOLBAR_HEIGHT = 64;
const usePaneStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative',
        paddingTop: `${TOOLBAR_HEIGHT}px`,
        boxSizing: 'border-box'
    },
    toolbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `${TOOLBAR_HEIGHT}px`
    },
    content: {
        height: '100%',
        overflow: 'hidden auto',
        boxSizing: 'border-box',
        padding: `0 ${theme.spacing(2)}px`
    }
}));

const Pane = ({ header, children, className, style, height, ...others }: PaneProps) => {
    const classes = usePaneStyles();
    const combinedClassName = combineClassNames(classes.root, className);
    let combinedStyle: React.CSSProperties = {
        ...style
    };
    if (height) {
        combinedStyle.height = typeof height === 'string' ? height : `${height}px`;
    }
    return (
        <div className={combinedClassName} style={combinedStyle} {...others}>
            <Toolbar className={classes.toolbar}>
                {header}
            </Toolbar>
            <div className={classes.content}>
                {children}
            </div>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(({
    effect, effectOptions,
    onEffectChange, onEffectOptionsChange
}: EffectPanelProps) => {
    const lang = useContext(LangContext);
    const filterBtnRef = useRef<HTMLButtonElement>(null);
    const [showFilterList, setShowFilterList] = useState(false);
    const [effectCategory, setEffectCategory] = useState(EMPTY_STRING);
    const [currentEffectsVM, setCurrentEffectsVM] = useState<EffectType[]>([]);
    const descriptor = useMemo(() => getEffectDescriptor(effect), [effect]);
    const onCategoryitemClick = (v: string) => {
        if (effectCategory === v) return;
        setEffectCategory(v);
        setShowFilterList(false);
    };
    const onEffectItemClick = (v: EffectType) => {
        if (v === effect) {
            onEffectChange(EffectType.NONE);
        } else {
            onEffectChange(v);
        }
    };
    useEffect(() => {
        setCurrentEffectsVM(EFFECTS.filter((e) => effectCategory === EMPTY_STRING || EFFECT_CATEGORY_MAP[e] === effectCategory));
    }, [effectCategory]);
    return (
        <React.Fragment>
            <Menu anchorEl={filterBtnRef.current} open={showFilterList} onClose={() => setShowFilterList(false)}>
                <MenuItem onClick={() => onCategoryitemClick(EMPTY_STRING)}>
                    {getLang('CATEGORY_ALL', lang)}
                </MenuItem>
                {
                    EFFECT_CATEGORIES.map((c) => (
                        <MenuItem selected={effectCategory === c} key={c}
                            onClick={() => onCategoryitemClick(c)}>
                            {
                                getLang(c, lang)
                            }
                        </MenuItem>
                    ))
                }
            </Menu>
            <Pane header={
                <React.Fragment>
                    <Typography variant="subtitle1">
                        {
                            getLang('EFFECT_LIST', lang)
                        }
                    </Typography>
                    <Placeholder />
                    <Tooltip title={getLang('FILTER_BY_EFFECT_CATEGORY', lang)}>
                        <Button ref={filterBtnRef} onClick={() => setShowFilterList(true)}>
                            <FilterList />
                            &nbsp;
                            {
                                getLang(effectCategory === EMPTY_STRING ? 'CATEGORY_ALL' : effectCategory, lang)
                            }
                        </Button>
                    </Tooltip>
                </React.Fragment>
            } height="50%">
                <Grid container>
                    {
                        currentEffectsVM.map((e) => (
                            <EffectItem key={e} xs={3} selected={effect === e}
                                title={getLang(EFFECT_LANG_MAP[e], lang)}
                                onClick={() => onEffectItemClick(e)}
                            />
                        ))
                    }
                </Grid>
            </Pane>
            <Pane header={
                <React.Fragment>
                    <Typography variant="subtitle1">
                        {
                            getLang('EFFECT_PROPERTIES', lang)
                        }
                    </Typography>
                </React.Fragment>
            } height="50%">
                <Box pl={2}>
                    <EffectPropertyPane
                        descriptor={descriptor}
                        value={effectOptions}
                        onChange={onEffectOptionsChange}
                    />
                </Box>
            </Pane>
        </React.Fragment>
    );
});