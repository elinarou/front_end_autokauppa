import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Addcar from './Addcar';
import Editcar from './Editcar';

export default function Carlist() {
    const [cars, setCars] = useState([]);
    const [open, setOpen] = React.useState(false);
    
    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
    };

    const deleteCar = (link) => {
        if (window.confirm('Are you sure?')) {
            fetch(link, {method: 'DELETE'})
            .then(response => fetchData())
            .catch(err => console.error(err))
            
            // Snackbar opens
            setOpen(true);
        };
    };

    const saveCar = (car) => {
        fetch('https://carstockrest.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(response => fetchData())
        .catch(err => console.error(err))
    };

    const updateCar = (car, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(response => fetchData())
        .catch(err => console.error(err))
    };

    // Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpen(false);
    };

    const columns = [
        {field: 'brand', filter: true, sortable: true},
        {field: 'model', filter: true, sortable: true},
        {field: 'color', filter: true, sortable: true},
        {field: 'fuel', filter: true, sortable: true},
        {field: 'year', filter: true, sortable: true},
        {field: 'price', filter: true, sortable: true},
        // Edit
        {headerName: '', width: 80,
        cellRenderer: row => <Editcar updateCar={updateCar} car={row.data}/>},
        // Delete
        {headerName: '', width: 115, field: '_links.self.href', 
        cellRenderer: ({value}) => <Button color="error" size="small" onClick={() => deleteCar(value)}>Delete</Button>}
    ]

    return (
        <div>
            <Addcar saveCar={saveCar}/>
            <div 
            className="ag-theme-material" 
            style={{
            width: '80%', 
            height: '700px',
            margin: 'auto'}}>  
            <AgGridReact
            columnDefs={columns}
            rowData={cars}
            />
            </div>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Car deleted"
            />
        </div>
    );
}