import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../redux/tasksSlice';
import { Button, InputGroup, FormControl, ButtonGroup } from 'react-bootstrap';

const TaskInput = () => {
    const [task, setTask] = useState('');
    const dispatch = useDispatch();

    const handleAddTask = () => {
        if (task.trim()) {
            dispatch(addTask(task));
            setTask('');
        }
    };

    return (
        <div className="mb-3">
            <InputGroup>
                <FormControl
                    placeholder="Enter a task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <Button variant="primary" onClick={handleAddTask}>Add Task</Button>
            </InputGroup>
        </div>
    );
};

export default TaskInput;
