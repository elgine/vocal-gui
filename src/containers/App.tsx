import React from 'react';
import Editor from './Editor';
import Messager from './Messager';
import TitleBar from './TitleBar';

const TITLE_BAR_HEIGHT = 46;

const IS_DESKTOP = (window as any).ELECTRON;
const editorStyle: React.CSSProperties = {
    paddingTop: `${TITLE_BAR_HEIGHT}px`
};

export default () => {
    return (
        <React.Fragment>
            <Messager />
            {
                IS_DESKTOP ? <TitleBar height={TITLE_BAR_HEIGHT} /> : undefined
            }
            <Editor style={IS_DESKTOP ? editorStyle : undefined} />
        </React.Fragment>
    );
};