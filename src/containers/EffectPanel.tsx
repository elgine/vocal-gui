import React, { useState, useContext, useRef, useEffect } from 'react';
import { Tooltip, IconButton, Toolbar, Grid, Box, Zoom, Button, Menu, MenuItem, Typography, Slide, Fade } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import { GridProps } from '@material-ui/core/Grid';
import { AudiotrackTwoTone, FilterList, ArrowBack }  from '@material-ui/icons';
import { withTheme, Theme, makeStyles } from '@material-ui/core/styles';
import { EFFECTS, EFFECT_LANG_MAP, EffectType, EFFECT_CATEGORY_MAP, EFFECT_CATEGORIES } from '../processor/effectType';
import { getLang, LangContext } from '../lang';
import { fade } from '../utils/color';
import combineClassNames from '../utils/combineClassNames';
import Placeholder from '../components/Placeholder';
import { EMPTY_STRING } from '../constant';

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

const EffectItem = withTheme(({ selected, title, theme, className, ...others }: EffectItemProps & {theme: Theme}) => {
    const classes = useStyles(theme);
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
});

const TOOLBAR_HEIGHT = 64;
const TOOLBAR_STYLE: React.CSSProperties = {
    position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100%', height: `${TOOLBAR_HEIGHT}px`
};

export interface EffectPanelProps extends Omit<BoxProps, 'onChange'>{
    // effect?: EffectType;
    // onEffectChange?: (v: EffectType) => void;
}

export default ({ ...others }: EffectPanelProps) => {
    const lang = useContext(LangContext);
    const filterBtnRef = useRef<HTMLButtonElement>(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showFilterList, setShowFilterList] = useState(false);
    const [effectCategory, setEffectCategory] = useState(EMPTY_STRING);
    const [currentEffectsVM, setCurrentEffectsVM] = useState<EffectType[]>([]);
    const [effect, setEffect] = useState(EffectType.NONE);
    const onCategoryitemClick = (v: string) => {
        if (effectCategory === v) return;
        setEffectCategory(v);
        setShowFilterList(false);
    };
    const onEffectItemClick = (v: EffectType) => {
        if (v === effect) {
            setEffect(EffectType.NONE);
        } else {
            setEffect(v);
            setShowDetail(true);
        }
    };
    useEffect(() => {
        setCurrentEffectsVM(EFFECTS.filter((e) => effectCategory === EMPTY_STRING || EFFECT_CATEGORY_MAP[e] === effectCategory));
    }, [effectCategory]);
    return (
        <Box position="relative" pt={`${TOOLBAR_HEIGHT}px`} px={2} pb={2} {...others}>
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
            <Toolbar style={TOOLBAR_STYLE}>
                <Fade in={showDetail}>
                    <IconButton onClick={() => setShowDetail(false)}>
                        <ArrowBack />
                    </IconButton>
                </Fade>
                <Placeholder />
                <Zoom in={!showDetail}>
                    <Tooltip title={getLang('FILTER_BY_EFFECT_CATEGORY', lang)}>
                        <Button ref={filterBtnRef} onClick={() => setShowFilterList(true)}>
                            <FilterList />
                            &nbsp;
                            {
                                getLang(effectCategory === EMPTY_STRING ? 'CATEGORY_ALL' : effectCategory, lang)
                            }
                        </Button>
                    </Tooltip>
                </Zoom>
            </Toolbar>
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
            <Slide direction="right" in={showDetail} timeout={400}>
                <Box position="absolute" top="0" left="0" width="100%" minHeight="100%" bgcolor="background.paper">

                </Box>
            </Slide>
        </Box>
    );
};