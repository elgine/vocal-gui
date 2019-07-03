import React from 'react';
import { MdLaunch } from 'react-icons/md';
import { connect } from 'react-redux';
import ControlBar from '../components/ControlBar';
import { FileState } from '../store/file/types';
import { Card, CardTitle } from '../components/Card';
import Avatar from '../components/Avatar';
import { Row, Col } from '../components/Grid';
import { TitleLoader } from '../components/Loader';
import Button from '../components/Button';

export interface HeaderProps extends BaseComponentProps{
    height?: number;
    file: FileState;
}

const mapStateToProps = (state: any) => {
    return {
        file: state.file
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(({ height, file, style, ...others }: HeaderProps) => {
    return (
        <ControlBar style={{ height: `${height}px`, ...style }}
            {...others}
            leftChildren={
                (
                    file.tag.loading ? (
                        <TitleLoader height={40} />
                    ) : (
                        <Card>
                            <Row gutter="md">
                                <Col>
                                    <Avatar shape="circular" size={48} src={file.tag.cover} alt={file.tag.title} />
                                </Col>
                                <Col>
                                    <CardTitle gutter="sm" title={file.tag.title} desc={file.tag.author} />
                                </Col>
                            </Row>
                        </Card>
                    )
                )
            }
            rightChildren={
                <React.Fragment>
                    <Button>
                        <MdLaunch />
                        &nbsp;
                        Export
                    </Button>
                </React.Fragment>
            }
        />
    );
});