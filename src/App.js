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
            <div className="app-background">
                <Container className="main-container">
                    <h1 className="text-center">To-Do List</h1>
                    <TaskInput />
                    <ButtonGroup className="mb-3">
                        <Button variant="primary" onClick={() => setView('incomplete')}>Incomplete Tasks</Button>
                        <Button variant="secondary" onClick={() => setView('completed')}>Completed Tasks</Button>
                        <Button variant="secondary" onClick={() => setView('all')}>All Tasks</Button>
                    </ButtonGroup>
                    <div className="list-container">
                        <TaskList view={view} /> {/* Pass the current view as a prop */}
                    </div>
                </Container>
            </div>
        </Provider>
    );
};

export default App;
