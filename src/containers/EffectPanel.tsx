import React, { useState, useContext, useRef, useEffect } from 'react';
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

const mapStateToProps = (state: any) => {
    return {};
};

const mapDispatchToProps = (dispatch: any) => {
    return {};
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
            <Toolbar variant="dense">
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
            </Toolbar>
            <Box px={2} py={1} maxHeight="50%" overflow="hidden auto">
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
            </Box>
            <Toolbar variant="dense">
                <Typography variant="subtitle1">
                    {
                        getLang('EFFECT_PROPERTIES', lang)
                    }
                </Typography>
            </Toolbar>
            <Box pl={6} pr={2} py={1}>
                <EffectPropertyPane value={effectOptions} onChange={onEffectOptionsChange} />
            </Box>
        </React.Fragment>
    );
});