import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RematchDispatch } from '@rematch/core';
import { RootState, Models } from '../store';
import {
    List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction,
    Checkbox,  Typography, IconButton,
    Menu, MenuItem, Divider, Toolbar, Tooltip,
    Button, Box, Badge
} from '@material-ui/core';
import { getLang } from '../lang';
import { MoreVert, PlayArrow, Stop, Cancel } from '@material-ui/icons';
import Placeholder from '../components/Placeholder';
import {
    ACTION_STOP_OUTPUT,
    ACTION_CANCEL_OUTPUT_ALL,
    ACTION_CANCEL_OUTPUT,
    ACTION_STOP_OUTPUT_ALL,
    ACTION_RESUME_OUTPUT
} from '../store/models/output/types';

const mapStateToProps = ({ present }: RootState) => {
    return {
        ...present.output,
        ...present.locale
    };
};

const mapLocaleStateToProps = ({ present }: RootState) => {
    return {
        ...present.locale
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
    const { lang } = useSelector(mapLocaleStateToProps, shallowEqual);
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

const TaskState = ({ state }: {state: number}) => {
    const { lang } = useSelector(mapLocaleStateToProps, shallowEqual);
    const color = state === -1 ? 'error' : (
        state === 3 ? 'primary' : 'inherit'
    );
    return (
        <Badge badgeContent={state > 0 && state < 3 ? (~~state + 1) : undefined} color="secondary">
            <Typography variant="button" color={color}>
                {
                    state === 0 ? getLang('WAITING', lang) : (
                        state === -1 ? getLang('FAILED', lang) : (
                            state === -2 ? getLang('STOPPED', lang) : (
                                state === 3 ? getLang('SUCCESS', lang) : `${(Number(state - ~~state) * 100).toFixed(2)} %`
                            )
                        )
                    )
                }
            </Typography>
        </Badge>
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
    state: number;
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
                    disabledStop={state >= 3 || state < 0}
                    onStop={onStop}
                    onCancel={onCancel}
                />
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default () => {
    const { tasks, lang } = useSelector(mapStateToProps);
    const dispatch = useDispatch<RematchDispatch<Models>>();
    const onResumeOutput = dispatch.output[ACTION_RESUME_OUTPUT];
    const onStopOutput = dispatch.output[ACTION_STOP_OUTPUT];
    const onStopAll = dispatch.output[ACTION_STOP_OUTPUT_ALL];
    const onCancelOutput = dispatch.output[ACTION_CANCEL_OUTPUT];
    const onCancelAll = dispatch.output[ACTION_CANCEL_OUTPUT_ALL];
    const [selectedTaskIds, setSelectedTaskIds] = useState({});
    const onResume = () => {
        onResumeOutput(selectedTaskIds);
    };
    const onStop = () => {
        onStopOutput(selectedTaskIds);
    };
    const onCancel = () => {
        onCancelOutput(selectedTaskIds);
    };
    const onTaskStop = (v: string) => {
        onStopOutput({
            [v]: v
        });
    };
    const onTaskCancel = (v: string) => {
        onCancelOutput({
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
    const isTaskArrEmpty = taskArr.length <= 0;
    const isNoneTaskSelected = Object.values(selectedTaskIds).length <= 0;
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
            {
                !isTaskArrEmpty ? (
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
                ) : (
                    <Box py={2} textAlign="center">
                        <Typography variant="subtitle2" paragraph>
                            {
                                getLang('NO_OUTPUT_TASK', lang)
                            }
                        </Typography>
                    </Box>
                )
            }
            <Divider />
            <Toolbar>
                <Tooltip title={getLang('START', lang)}>
                    <div>
                        <IconButton disabled={isNoneTaskSelected} onClick={onResume}>
                            <PlayArrow />
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title={getLang('STOP', lang)}>
                    <div>
                        <IconButton disabled={isNoneTaskSelected} onClick={onStop}>
                            <Stop />
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title={getLang('CANCEL', lang)}>
                    <div>
                        <IconButton disabled={isNoneTaskSelected} onClick={onCancel}>
                            <Cancel />
                        </IconButton>
                    </div>
                </Tooltip>
                <Placeholder />
                <Button disabled={isTaskArrEmpty} onClick={onStopAll}>
                    {
                        getLang('STOP_ALL', lang)
                    }
                </Button>
                <Button disabled={isTaskArrEmpty} onClick={onCancelAll}>
                    {
                        getLang('CANCEL_ALL', lang)
                    }
                </Button>
            </Toolbar>
        </React.Fragment>
    );
};