import React from 'react';
import Editor from './Editor';
import Messager from './Messager';
import TitleBar from './TitleBar';

const TITLE_BAR_HEIGHT = 32;

export default () => {
    return (
        <React.Fragment>
            {
                window.__ELECTRON__ ? (
                    <TitleBar style={{ height: `${TITLE_BAR_HEIGHT}px` }} />
                ) : undefined
            }
            <Messager />
            <Editor style={window.__ELECTRON__ ? { paddingTop: `${TITLE_BAR_HEIGHT}px` } : {}} />
        </React.Fragment>
    );
};