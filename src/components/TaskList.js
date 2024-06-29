import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask, editTask, toggleTaskCompletion, setTaskPriority } from '../redux/tasksSlice';
import { ListGroup, Button, FormCheck, Container, ButtonGroup, InputGroup, FormControl } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskList = ({ view }) => {
    const tasks = useSelector((state) => state.tasks.tasks);
    const dispatch = useDispatch();
    const [timers, setTimers] = useState([]);
    const [timerInput, setTimerInput] = useState('');
    const [showAllTasks, setShowAllTasks] = useState(false); // State to toggle showing all tasks
    const [editTimerIndex, setEditTimerIndex] = useState(null); // State to track which task's timer is being edited
    const [viewState, setViewState] = useState(view); // State to manage the current view

    useEffect(() => {
        // Save tasks to local storage whenever tasks change
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const startTimer = (index, time) => {
        const timerId = setTimeout(() => {
            toast.warn(`Task "${tasks[index].text}" is overdue!`);
        }, time);

        setTimers(prevTimers => {
            const updatedTimers = [...prevTimers];
            updatedTimers[index] = timerId;
            return updatedTimers;
        });
        toast.info(`Timer set for task "${tasks[index].text}"`);
    };

    const clearTimer = (index) => {
        if (timers[index]) {
            clearTimeout(timers[index]);
            toast.success(`Timer cleared for task "${tasks[index].text}"`);
            setTimers(prevTimers => {
                const updatedTimers = [...prevTimers];
                updatedTimers[index] = null;
                return updatedTimers;
            });
        }
    };

    const handleTimerInputChange = (event) => {
        setTimerInput(event.target.value);
    };

    const handleSetTimer = (index) => {
        const time = parseInt(timerInput, 10); // Convert input to integer (milliseconds)
        if (!isNaN(time)) {
            startTimer(index, time);
            setTimerInput('');
        } else {
            toast.error('Please enter a valid number for the timer (milliseconds).');
        }
    };

    const handleEditTimer = (index) => {
        setEditTimerIndex(index);
        setTimerInput(''); // Reset timer input field when editing timer
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'danger';
            case 'medium':
                return 'warning';
            case 'low':
                return 'success';
            default:
                return '';
        }
    };

    const handlePriorityChange = (index, priority) => {
        dispatch(setTaskPriority({ index, priority }));
        toast.success(`Priority updated for task "${tasks[index].text}"`);
    };

    const handleToggleTasks = (type) => {
        if (type === 'all') {
            setShowAllTasks(true);
            setViewState('all');
        } else {
            setShowAllTasks(false);
            setViewState(type); // 'incomplete' or 'completed', depending on your logic
        }
    };

    const handleTaskCompletionToggle = (index) => {
        dispatch(toggleTaskCompletion(index));
        if (!tasks[index].completed) {
            clearTimer(index);
            toast.success(`Task "${tasks[index].text}" completed!`);
        }
    };

    const handleTaskEdit = (index) => {
        const newText = prompt('Edit Task:', tasks[index].text);
        if (newText !== null) {
            dispatch(editTask({ index, newText }));
            toast.info(`Task "${tasks[index].text}" updated`);
        }
    };

    const handleTaskDelete = (index) => {
        const taskText = tasks[index].text;
        dispatch(deleteTask(index));
        toast.error(`Task "${taskText}" deleted`);
    };

    const filteredTasks = showAllTasks
        ? tasks
        : viewState === 'incomplete'
            ? tasks.filter(task => !task.completed)
            : tasks.filter(task => task.completed);

    return (
        <Container>
            <h3>{showAllTasks ? 'All Tasks' : viewState === 'incomplete' ? 'Incomplete Tasks' : 'Completed Tasks'}</h3>
            <ButtonGroup className="mb-3">
                <Button
                    variant="primary"
                    onClick={() => handleToggleTasks('incomplete')}
                    className={viewState === 'incomplete' ? 'active' : ''}
                >
                    Incomplete Tasks
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => handleToggleTasks('completed')}
                    className={viewState === 'completed' ? 'active' : ''}
                >
                    Completed Tasks
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => handleToggleTasks('all')}
                    className={viewState === 'all' ? 'active' : ''}
                >
                    All Tasks
                </Button>
            </ButtonGroup>
            <ListGroup>
                {filteredTasks.map((task, index) => (
                    <ListGroup.Item
                        key={index}
                        className={`d-flex justify-content-between align-items-center ${task.priority ? `bg-${getPriorityColor(task.priority)}` : ''}`}
                    >
                        <FormCheck
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskCompletionToggle(index)}
                            label={<span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</span>}
                        />
                        {!task.completed && (
                            <div className="d-flex align-items-center">
                                <ButtonGroup className="me-2">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleSetTimer(index)}
                                        disabled={timers[index] !== undefined && timers[index] !== null}
                                        className="border border-dark">
                                        Set Timer
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => clearTimer(index)}
                                        disabled={!timers[index]}
                                        className="border border-dark">
                                        Clear Timer
                                    </Button>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => handleEditTimer(index)}
                                        className="border border-dark">
                                        Edit Timer
                                    </Button>
                                </ButtonGroup>
                                <InputGroup style={{ maxWidth: '150px' }}>
                                    <FormControl
                                        placeholder="Timer (ms)"
                                        value={timerInput}
                                        onChange={handleTimerInputChange}
                                        aria-label="Timer input"
                                        aria-describedby="timer-input"
                                    />
                                </InputGroup>
                            </div>
                        )}
                        <div>
                            {viewState === 'incomplete' && (
                                <ButtonGroup className="me-2">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handlePriorityChange(index, 'high')}
                                        className="border border-dark">
                                        High
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => handlePriorityChange(index, 'medium')}
                                        className="border border-dark">
                                        Medium
                                    </Button>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handlePriorityChange(index, 'low')}
                                        className="border border-dark">
                                        Low
                                    </Button>
                                </ButtonGroup>
                            )}
                            {editTimerIndex === index && !task.completed && (
                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => {
                                        startTimer(index, parseInt(timerInput, 10));
                                        setEditTimerIndex(null); // Clear edit mode
                                        toast.info(`Timer updated for task "${tasks[index].text}"`);
                                    }}
                                    className="ms-2 border border-dark">
                                    Save Timer
                                </Button>
                            )}
                            {viewState === 'incomplete' && (
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleTaskEdit(index)}
                                    className="ms-2 border border-dark">
                                    Edit
                                </Button>
                            )}
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleTaskDelete(index)}
                                className="ms-2 border border-dark">
                                Delete
                            </Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <ToastContainer /> {/* ToastContainer for react-toastify */}
        </Container>
    );
};

export default TaskList;
