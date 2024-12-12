import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Paper, TableSortLabel, IconButton, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditCustomer from './EditCustomer';

const API_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('firstname');
  const [orderDirection, setOrderDirection] = useState('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCustomers(data._embedded.customers);
      setFilteredCustomers(data._embedded.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
    setFilteredCustomers(customers.filter((customer) =>
      Object.values(customer).some(val =>
        val && val.toString().toLowerCase().includes(value)
      )
    ));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setFilteredCustomers(filteredCustomers.slice().sort((a, b) => {
      const valA = a[property] || '';
      const valB = b[property] || '';
      return isAsc
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    }));
  };

  const handleDelete = async (url) => {
    try {
      if (window.confirm('Are you sure?')) {
        const response = await fetch(url, { method: 'DELETE' });
        if (response.ok) {
          fetchCustomers();
        } else {
          console.error('Error deleting customer:', response.status);
        }
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const openDialog = (customer = null) => {
    setIsEditing(!!customer);
    setEditUrl(customer ? customer._links.self.href : '');
    setCurrentCustomer(customer || null);
    setDialogOpen(true);
  };

  const handleSaveCustomer = async (customer) => {
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? editUrl : API_URL;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });

      if (response.ok) {
        fetchCustomers();
        setDialogOpen(false);
      } else {
        console.error('Error saving customer:', response.status);
      }
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  return (
    <div>
      <h1>Customers</h1>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
      />
      <Button variant="contained" color="primary" onClick={() => openDialog()}>
        Add Customer
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['firstname', 'lastname', 'email', 'phone', 'streetaddress', 'postcode', 'city'].map((field) => (
                <TableCell key={field}>
                  <TableSortLabel
                    active={orderBy === field}
                    direction={orderDirection}
                    onClick={() => handleSort(field)}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer._links.self.href}>
                <TableCell>{customer.firstname}</TableCell>
                <TableCell>{customer.lastname}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.streetaddress}</TableCell>
                <TableCell>{customer.postcode}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => openDialog(customer)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(customer._links.self.href)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EditCustomer
        isOpen={dialogOpen}
        customer={currentCustomer}
        onSave={handleSaveCustomer}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default CustomerPage;