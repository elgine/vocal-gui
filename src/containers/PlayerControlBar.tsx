import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FiRepeat } from 'react-icons/fi';
import verticalAlign from '../components/mixins/verticalAlign';
import Volume from '../components/Volume';
import Button, { PlayButton } from '../components/Button';
import Tooltip from '../components/Tooltip';

const playerControlBarStyles = (theme: Theme): any => {
    return {
        display: 'flex',
        '.left, .center, .right': {
            flexShrink: 0,
            ...verticalAlign()
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
                <PlayButton flat iconSize={ICON_SIZE * 1.5} />
            </div>
            <div className="right">
                <Tooltip anchorPos={{ horizontal: 'center', vertical: 'top' }}
                    transformPos={{ horizontal: 'center', vertical: 'bottom' }}
                    title="Loop">
                    <Button flat>
                        <FiRepeat size={ICON_SIZE} />
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};