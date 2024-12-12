import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import CustomerPage from './CustomerPage';
import TrainingPage from './TrainingPage';

const App = () => {
  return (
    <Router>
      <div>
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Personal Trainer Website
            </Typography>
            <Button color="inherit" component={Link} to="/">Customers</Button>
            <Button color="inherit" component={Link} to="/trainings">Trainings</Button>
          </Toolbar>
        </AppBar>
        <main style={{ marginTop: '80px' }}>
          <Routes>
            <Route path="/" element={<CustomerPage />} />
            <Route path="/trainings" element={<TrainingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;