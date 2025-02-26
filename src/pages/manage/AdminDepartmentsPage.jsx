// src/pages/AdminDepartmentsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableSortLabel,
  Snackbar,
  Alert
} from "@mui/material";
import { 
  Delete, 
  Edit, 
  Search, 
  Add as AddIcon,
  Business as BusinessIcon 
} from "@mui/icons-material";
import { API } from "../../api/post";

const AdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  
  // Form state
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDeptId, setCurrentDeptId] = useState(null);
  const [departmentName, setDepartmentName] = useState("");
  const [nameError, setNameError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/departments/");
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to load departments");
      showSnackbar("Failed to load departments", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (department) => {
    if (window.confirm(`Are you sure you want to delete department '${department.name}'?`)) {
      try {
        await API.delete(`/departments/${department.id}/`);
        showSnackbar("Department deleted successfully", "success");
        fetchDepartments();
      } catch (error) {
        console.error("Error deleting department:", error);
        // Check for 409 Conflict (if department has users)
        if (error.response?.status === 409) {
          showSnackbar("Cannot delete department as it has users assigned to it", "error");
        } else {
          showSnackbar("Failed to delete department", "error");
        }
      }
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      let valueA = a[orderBy];
      let valueB = b[orderBy];

      if (order === "desc") {
        [valueA, valueB] = [valueB, valueA];
      }

      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    });
  };

  const filterData = (data) => {
    if (!searchTerm) return data;
    
    return data.filter(dept => 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const openCreateDialog = () => {
    setIsEditing(false);
    setCurrentDeptId(null);
    setDepartmentName("");
    setNameError("");
    setOpenDialog(true);
  };

  const openEditDialog = (department) => {
    setIsEditing(true);
    setCurrentDeptId(department.id);
    setDepartmentName(department.name);
    setNameError("");
    setOpenDialog(true);
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!departmentName.trim()) {
      setNameError("Department name is required");
      isValid = false;
    } else {
      setNameError("");
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      if (isEditing) {
        await API.put(`/departments/${currentDeptId}/`, { name: departmentName });
        showSnackbar("Department updated successfully", "success");
      } else {
        await API.post("/departments/", { name: departmentName });
        showSnackbar("Department created successfully", "success");
      }
      
      setOpenDialog(false);
      fetchDepartments();
    } catch (error) {
      console.error("Error saving department:", error);
      const errorMessage = error.response?.data?.detail || "An error occurred while saving the department";
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const renderSortableHeader = (id, label) => (
    <TableCell>
      <TableSortLabel
        active={orderBy === id}
        direction={orderBy === id ? order : "asc"}
        onClick={() => handleRequestSort(id)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  const renderContent = () => {
    if (loading && departments.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
            <Typography color="error">{error}</Typography>
          </TableCell>
        </TableRow>
      );
    }

    const filteredData = filterData(departments);
    const sortedData = sortData(filteredData);

    if (sortedData.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
            <Typography>No departments found</Typography>
          </TableCell>
        </TableRow>
      );
    }

    return sortedData.map((department) => (
      <TableRow key={department.id}>
        <TableCell>{department.id}</TableCell>
        <TableCell>{department.name}</TableCell>
        <TableCell>
          <IconButton 
            size="small" 
            color="primary"
            onClick={() => openEditDialog(department)}
          >
            <Edit />
          </IconButton>
          <IconButton 
            size="small" 
            color="error"
            onClick={() => handleDelete(department)}
          >
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Department Management</Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            disabled={loading}
          >
            Add Department
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width="10%">ID</TableCell>
                {renderSortableHeader("name", "Department Name")}
                <TableCell width="15%">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderContent()}</TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create/Edit Department Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white", py: 2 }}>
          {isEditing ? "Edit Department" : "Create New Department"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <BusinessIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="subtitle1">Department Information</Typography>
          </Box>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Department Name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: "background.default" }}>
          <Button 
            variant="outlined" 
            onClick={() => setOpenDialog(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : isEditing ? "Update Department" : "Create Department"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminDepartmentsPage;