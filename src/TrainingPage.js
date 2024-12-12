import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Paper, TableSortLabel, IconButton, Button, Dialog,
  DialogActions, DialogContent, DialogTitle, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, parseISO } from 'date-fns';

const API_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';

const TrainingPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('date');
  const [orderDirection, setOrderDirection] = useState('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTraining, setCurrentTraining] = useState({
    date: '',
    duration: '',
    activity: '',
    customer: ''
  });

  useEffect(() => {
    fetchTrainings();
    fetchCustomers();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await fetch(`${API_URL}/gettrainings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTrainings(data);
      setFilteredTrainings(data);
    } catch (error) {
      console.error('Error fetching trainings:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCustomers(data._embedded.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
    setFilteredTrainings(trainings.filter((training) =>
      Object.values(training).some(val =>
        val && val.toString().toLowerCase().includes(value)
      )
    ));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setFilteredTrainings(filteredTrainings.slice().sort((a, b) => {
      let valA = a[property] || '';
      let valB = b[property] || '';

      if (property === 'customer') {
        valA = `${a.customer.firstname} ${a.customer.lastname}`;
        valB = `${b.customer.firstname} ${b.customer.lastname}`;
      }

      if (typeof valA === 'string') {
        return isAsc
          ? valA.toLowerCase().localeCompare(valB.toLowerCase())
          : valB.toLowerCase().localeCompare(valA.toLowerCase());
      } else if (typeof valA === 'number') {
        return isAsc ? valA - valB : valB - valA;
      }
      return 0;
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const response = await fetch(`${API_URL}/trainings/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchTrainings();
        } else {
          console.error('Error deleting training:', response.status);
        }
      } catch (error) {
        console.error('Error deleting training:', error);
      }
    }
  };

  const openDialog = () => {
    setCurrentTraining({
      date: '',
      duration: '',
      activity: '',
      customer: ''
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentTraining({
      date: '',
      duration: '',
      activity: '',
      customer: ''
    });
  };

  const handleSave = async () => {
    const body = {
      date: currentTraining.date,
      duration: currentTraining.duration,
      activity: currentTraining.activity,
      customer: `${API_URL}/customers/${currentTraining.customer}`
    };

    try {
      const response = await fetch(`${API_URL}/trainings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchTrainings();
        handleDialogClose();
      } else {
        console.error('Error saving training:', response.status);
      }
    } catch (error) {
      console.error('Error saving training:', error);
    }
  };

  return (
    <div>
      <h1>Trainings</h1>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
      />
      <Button variant="contained" color="primary" onClick={openDialog}>
        Add Training
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderDirection}
                  onClick={() => handleSort('date')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'duration'}
                  direction={orderDirection}
                  onClick={() => handleSort('duration')}
                >
                  Duration
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'activity'}
                  direction={orderDirection}
                  onClick={() => handleSort('activity')}
                >
                  Activity
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'customer'}
                  direction={orderDirection}
                  onClick={() => handleSort('customer')}
                >
                  Customer
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrainings.map((training) => (
              <TableRow key={training.id}>
                <TableCell>
                  {format(parseISO(training.date), 'dd.MM.yyyy HH:mm')}
                </TableCell>
                <TableCell>{training.duration} min</TableCell>
                <TableCell>{training.activity}</TableCell>
                <TableCell>{`${training.customer.firstname} ${training.customer.lastname}`}</TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleDelete(training.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Training</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Date"
            type="datetime-local"
            fullWidth
            value={currentTraining.date}
            onChange={(e) => setCurrentTraining({ ...currentTraining, date: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Duration (minutes)"
            type="number"
            fullWidth
            value={currentTraining.duration}
            onChange={(e) => setCurrentTraining({ ...currentTraining, duration: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Activity"
            type="text"
            fullWidth
            value={currentTraining.activity}
            onChange={(e) => setCurrentTraining({ ...currentTraining, activity: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Customer"
            select
            fullWidth
            value={currentTraining.customer}
            onChange={(e) => setCurrentTraining({ ...currentTraining, customer: e.target.value })}
          >
            {customers.map((customer) => (
              <MenuItem key={customer._links.self.href} value={customer._links.self.href.split('/').pop()}>
                {`${customer.firstname} ${customer.lastname}`}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TrainingPage;