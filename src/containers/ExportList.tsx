import React, { useState, useContext, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { RootState, Models } from '../store';
import { List, ListItem, ListItemIcon, Checkbox, ListItemText, ListItemSecondaryAction, Typography, IconButton, Menu, MenuItem, Divider, Toolbar, Tooltip, Button } from '@material-ui/core';
import { RenderTaskState } from '../processor/renderer';
import { LangContext, getLang } from '../lang';
import { MoreVert, PlayArrow, Stop, Cancel } from '@material-ui/icons';
import Placeholder from '../components/Placeholder';
import { ACTION_STOP_RENDERING, ACTION_CANCEL_RENDERING_ALL, ACTION_CANCEL_RENDERING, ACTION_STOP_RENDERING_ALL, ACTION_START_RENDERING } from '../store/models/render/types';

const mapStateToProps = ({ present }: RootState) => {
    return {
        ...present.render
    };
};

const LIST_STYLE: React.CSSProperties = {
    maxHeight: '400PX',
    height: '100%',
    overflowY: 'auto'
};

interface ActionButtonProps{
    id: string;
    disabledCancel?: boolean;
    disabledStop?: boolean;
    onCancel: (v: string) => void;
    onStop: (v: string) => void;
}

const ActionButton = ({ id, disabledCancel, disabledStop, onCancel, onStop }: ActionButtonProps) => {
    const lang =  useContext(LangContext);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [openMenu, setOpenMenu] = useState(false);
    const onClickStop = () => {
        onStop(id);
        setOpenMenu(false);
    };
    const onClickCancel = () => {
        onCancel(id);
        setOpenMenu(false);
    };
    return (
        <React.Fragment>
            <IconButton ref={buttonRef} onClick={() => setOpenMenu(true)}>
                <MoreVert />
            </IconButton>
            <Menu open={openMenu} anchorEl={buttonRef.current}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                onClose={() => setOpenMenu(false)}>
                <MenuItem disabled={disabledStop} onClick={onClickStop}>
                    <ListItemText>
                        {
                            getLang('STOP', lang)
                        }
                    </ListItemText>
                </MenuItem>
                <MenuItem disabled={disabledCancel} onClick={onClickCancel}>
                    <ListItemText>
                        {
                            getLang('CANCEL', lang)
                        }
                    </ListItemText>
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
};

const TaskState = ({ state }: {state: RenderTaskState}) => {
    const lang = useContext(LangContext);
    const color = state === RenderTaskState.FAILED ? 'error' : (
        state === RenderTaskState.COMPLETE ? 'primary' : 'inherit'
    );
    return (
        <Typography variant="button" color={color}>
            {
                state === RenderTaskState.WAITING ? getLang('WAITING', lang) : (
                    state === RenderTaskState.FAILED ? getLang('FAILED', lang) : (
                        state === RenderTaskState.STOPPED ? getLang('STOPPED', lang) :
                        `${Number(state) * 100} %`
                    )
                )
            }
        </Typography>
    );
};

const TASK_TITLE_STYLE: React.CSSProperties = {
    maxWidth: '200px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
};

interface TaskProps{
    id: string;
    state: RenderTaskState;
    title?: string;
    selected?: boolean;
    onSelected: (v: string) => void;
    onCancel: (v: string) => void;
    onStop: (v: string) => void;
}

const Task = ({ id, state, selected, title, onSelected, onCancel, onStop }: TaskProps) => {
    const onListItemClick = () => {
        onSelected && onSelected(id);
    };
    return (
        <ListItem button onClick={onListItemClick}>
            <ListItemIcon>
                <Checkbox checked={selected} />
            </ListItemIcon>
            <ListItemText style={TASK_TITLE_STYLE}>
                {title}
            </ListItemText>
            <ListItemSecondaryAction>
                <TaskState state={state} />
                <ActionButton id={id}
                    disabledStop={state >= 1 || state < 0}
                    onStop={onStop}
                    onCancel={onCancel}
                />
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default () => {
    const lang = useContext(LangContext);
    const { tasks } = useSelector(mapStateToProps);
    const dispatch = useDispatch<RematchDispatch<Models>>();
    const onStartRendering = dispatch.render[ACTION_START_RENDERING];
    const onStopRendering = dispatch.render[ACTION_STOP_RENDERING];
    const onStopAll = dispatch.render[ACTION_STOP_RENDERING_ALL];
    const onCancelRendering = dispatch.render[ACTION_CANCEL_RENDERING];
    const onCancelAll = dispatch.render[ACTION_CANCEL_RENDERING_ALL];
    const [selectedTaskIds, setSelectedTaskIds] = useState({});
    const onStart = () => {
        onStartRendering(selectedTaskIds);
    };
    const onStop = () => {
        onStopRendering(selectedTaskIds);
    };
    const onCancel = () => {
        onCancelRendering(selectedTaskIds);
    };
    const onTaskStop = (v: string) => {
        onStopRendering({
            [v]: v
        });
    };
    const onTaskCancel = (v: string) => {
        onCancelRendering({
            [v]: v
        });
    };
    const onTaskSelected = (v: string) => {
        if (selectedTaskIds[v]) {
            let newSelected = { ...selectedTaskIds };
            Reflect.deleteProperty(newSelected, v);
            setSelectedTaskIds(newSelected);
        } else {
            setSelectedTaskIds({
                ...selectedTaskIds,
                [v]: v
            });
        }
    };
    const taskArr = Object.values(tasks);
    useEffect(() => {
        let newTaskIds = {};
        for (let k in selectedTaskIds) {
            if (tasks[k]) {
                newTaskIds[k] = k;
            }
        }
        setSelectedTaskIds(newTaskIds);
    }, [tasks, selectedTaskIds]);
    return (
        <React.Fragment>
            <List style={LIST_STYLE}>
                {
                    taskArr.map(({ id, title, state }) => (
                        <Task key={id} id={id} title={title} state={state}
                            selected={selectedTaskIds[id] !== undefined}
                            onSelected={onTaskSelected}
                            onStop={onTaskStop}
                            onCancel={onTaskCancel}
                        />
                    ))
                }
            </List>
            <Divider />
            <Toolbar>
                <Tooltip title={getLang('START', lang)}>
                    <IconButton onClick={onStart}>
                        <PlayArrow />
                    </IconButton>
                </Tooltip>
                <Tooltip title={getLang('STOP', lang)}>
                    <IconButton onClick={onStop}>
                        <Stop />
                    </IconButton>
                </Tooltip>
                <Tooltip title={getLang('CANCEL', lang)}>
                    <IconButton onClick={onCancel}>
                        <Cancel />
                    </IconButton>
                </Tooltip>
                <Placeholder />
                <Button onClick={onStopAll}>
                    {
                        getLang('STOP_ALL', lang)
                    }
                </Button>
                <Button onClick={onCancelAll}>
                    {
                        getLang('CANCEL_ALL', lang)
                    }
                </Button>
            </Toolbar>
        </React.Fragment>
    );
};