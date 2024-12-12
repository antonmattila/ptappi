import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button
} from '@mui/material';

const EditCustomer = ({ isOpen, customer, onSave, onClose }) => {
    const [currentCustomer, setCurrentCustomer] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        streetaddress: '',
        postcode: '',
        city: '',
    });

    useEffect(() => {
        setCurrentCustomer(customer || {
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            streetaddress: '',
            postcode: '',
            city: '',
        });
    }, [customer]);

    const handleChange = (field) => (event) => {
        setCurrentCustomer({ ...currentCustomer, [field]: event.target.value });
    };

    const handleSave = () => {
        onSave(currentCustomer);
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>{customer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
            <DialogContent>
                {['firstname', 'lastname', 'email', 'phone', 'streetaddress', 'postcode', 'city'].map((field) => (
                    <TextField
                        key={field}
                        margin="dense"
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        type="text"
                        fullWidth
                        value={currentCustomer[field]}
                        onChange={handleChange(field)}
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCustomer;