// App.jsx
import React from 'react';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import { DummyDataService } from '../../data/DummyDataService';
import CRUDDataGrid from '../components/CRUDDataGrid';

const theme = createTheme();

const NurseCareer = () => {
  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 90 
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 150, 
      editable: true 
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 200, 
      editable: true 
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 130, 
      editable: true 
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130, 
      editable: true 
    },
  ];

  // Custom validation function
  // const validateRow = (data) => {
  //   const errors = {};
    
  //   if (!data.name?.trim()) {
  //     errors.name = 'Name is required';
  //   }
    
  //   if (!data.email?.trim()) {
  //     errors.email = 'Email is required';
  //   } else if (!/\S+@\S+\.\S+/.test(data.email)) {
  //     errors.email = 'Invalid email format';
  //   }
    
  //   if (!data.role?.trim()) {
  //     errors.role = 'Role is required';
  //   }
    
  //   if (!data.status?.trim()) {
  //     errors.status = 'Status is required';
  //   }

  //   return {
  //     isValid: Object.keys(errors).length === 0,
  //     errors
  //   };
  // };

  // Instead of actual API calls, we'll use our dummy service
  const customEndpoints = {
    fetch: async () => {
      const data = await DummyDataService.fetchData();
      return { data };
    },
    create: async (data) => {
      const result = await DummyDataService.createData(data);
      return { data: result };
    },
    update: async (id, data) => {
      const result = await DummyDataService.updateData(id, data);
      return { data: result };
    },
    delete: async (id) => {
      await DummyDataService.deleteData(id);
      return { success: true };
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100vh', p: 3 }}>
        <CRUDDataGrid
          title="User Management System"
          columns={columns}
          customEndpoints={customEndpoints}
          defaultSort={[{ field: 'name', sort: 'asc' }]}
          onError={(error) => console.error('Error:', error)}
          onSuccess={(operation) => console.log(`${operation} completed successfully`)}
        />
      </Box>
    </ThemeProvider>
  );
};

export default NurseCareer;