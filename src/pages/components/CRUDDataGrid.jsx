import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const CRUDDataGrid = ({
  columns = [],
  defaultSort = [],
  title = 'Data Management',
  customEndpoints,
  validateRow = () => ({ isValid: true, errors: {} }),
  onError = (error) => console.error(error),
  onSuccess = () => {},
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customEndpoints.fetch();
      setRows(response.data);
      showSnackbar('Data loaded successfully', 'success');
    } catch (error) {
      onError(error);
      showSnackbar('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const resetForm = () => {
    setFormData({});
    setFormErrors({});
    setCurrentRow(null);
  };

  const handleClose = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleCreate = async () => {
    const validation = validateRow(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      await customEndpoints.create(formData);
      showSnackbar('Record created successfully', 'success');
      handleClose();
      fetchData();
      onSuccess('create');
    } catch (error) {
      onError(error);
      showSnackbar('Error creating record', 'error');
    }
  };

  const handleUpdate = async () => {
    const validation = validateRow(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      await customEndpoints.update(currentRow.id, formData);
      showSnackbar('Record updated successfully', 'success');
      handleClose();
      fetchData();
      onSuccess('update');
    } catch (error) {
      onError(error);
      showSnackbar('Error updating record', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await customEndpoints.delete(id);
      showSnackbar('Record deleted successfully', 'success');
      fetchData();
      onSuccess('delete');
    } catch (error) {
      onError(error);
      showSnackbar('Error deleting record', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const columnsWithActions = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => {
              setCurrentRow(params.row);
              setFormData(params.row);
              setOpenDialog(true);
            }}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            size="small"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
        >
          Add New
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={columnsWithActions}
        loading={loading}
        sortModel={defaultSort}
        components={{
          Toolbar: GridToolbar,
        }}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5, 10, 25]}
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell:hover': {
            cursor: 'pointer',
          },
        }}
      />

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentRow ? 'Edit Record' : 'Create New Record'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {columns
              .filter(col => col.field !== 'id' && col.editable !== false)
              .map(col => (
                <TextField
                  key={col.field}
                  name={col.field}
                  label={col.headerName}
                  value={formData[col.field] || ''}
                  onChange={handleInputChange}
                  error={!!formErrors[col.field]}
                  helperText={formErrors[col.field]}
                  fullWidth
                />
              ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={currentRow ? handleUpdate : handleCreate}
            variant="contained"
            color="primary"
          >
            {currentRow ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CRUDDataGrid;