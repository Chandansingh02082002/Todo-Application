import { createSlice } from '@reduxjs/toolkit';

// Load tasks from local storage or initialize empty array
const initialState = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
};

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action) => {
            state.tasks.push({ text: action.payload, completed: false, priority: 'low' }); // Default priority is 'low'
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter((_, index) => index !== action.payload);
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        },
        editTask: (state, action) => {
            const { index, newText } = action.payload;
            state.tasks[index].text = newText;
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        },
        toggleTaskCompletion: (state, action) => {
            const task = state.tasks[action.payload];
            task.completed = !task.completed;
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        },
        setTaskPriority: (state, action) => {
            const { index, priority } = action.payload;
            state.tasks[index].priority = priority;
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        },
    },
});

export const { addTask, deleteTask, editTask, toggleTaskCompletion, setTaskPriority } = tasksSlice.actions;
export default tasksSlice.reducer;
