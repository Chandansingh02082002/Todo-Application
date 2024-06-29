import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import store from './redux/store';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import './App.css';

const App = () => {
    const [view, setView] = useState('incomplete'); // State to manage the current view

    return (
        <Provider store={store}>
            <Container className="mt-5">
                <h1 className="text-center">To-Do List</h1>
                <TaskInput />
             
                <TaskList view={view} /> {/* Pass the current view as a prop */}
            </Container>
        </Provider>
    );
};

export default App;
