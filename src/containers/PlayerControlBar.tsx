import React from 'react';
import { merge } from 'lodash';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { MdSkipPrevious, MdSkipNext, MdRepeat } from 'react-icons/md';
import verticalAlign from '../components/mixins/verticalAlign';
import Volume from '../components/Volume';
import Button, { PlayButton } from '../components/Button';
import Tooltip from '../components/Tooltip';
import RepeatButton from '../components/Button/RepeatButton';
import gutter from '../components/mixins/gutter';

const playerControlBarStyles = (theme: Theme): any => {
    return {
        display: 'flex',
        '.left, .center, .right': {
            flexShrink: 0,
            ...merge(
                verticalAlign(),
                gutter(theme.spacing.sm)
            )
        },
        '.left': {
            textAlign: 'left'
        },
        '.center': {
            textAlign: 'center',
            flex: 1
        },
        '.right': {
            textAlign: 'right'
        }
    };
};

const ICON_SIZE = 16;

export default ({ ...others }: React.HTMLAttributes<{}>) => {
    return (
        <div css={playerControlBarStyles} {...others}>
            <div className="left">
                <Volume anchorPos={{ horizontal: 'center', vertical: 'top' }}
                    transformPos={{ horizontal: 'center', vertical: 'bottom' }}
                    vertical
                    iconSize={ICON_SIZE}
                />
            </div>
            <div className="center">
                <Button flat>
                    <MdSkipPrevious size={ICON_SIZE} />
                </Button>
                <PlayButton size="lg" flat iconSize={ICON_SIZE * 2} />
                <Button flat>
                    <MdSkipNext size={ICON_SIZE} />
                </Button>
            </div>
            <div className="right">
                <RepeatButton flat iconSize={ICON_SIZE} />
            </div>
        </div>
    );
};