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
  Grid,
  TableSortLabel,
  Divider,
  FormHelperText,
  Snackbar,
  Alert,
  Tooltip
} from "@mui/material";
import { Delete, Edit, Add as AddIcon, Search } from "@mui/icons-material";
import { API } from "../../api/post";

const LevelReferencePage = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("level");
  const [order, setOrder] = useState("asc");
  
  // Form state
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLevelId, setCurrentLevelId] = useState(null);
  const [formData, setFormData] = useState({
    level: "",
    next_level: "",
    required_time_in_month: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    level: null
  });

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/levels/");
      setLevels(response.data || []);
    } catch (error) {
      console.error("Error fetching levels:", error);
      setError("Failed to load levels");
      showSnackbar("Failed to load levels", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (level) => {
    setDeleteDialog({
      open: true,
      level
    });
  };

  const handleDelete = async () => {
    try {
      const { level } = deleteDialog;
      await API.delete(`/levels/${level.id}/`);
      showSnackbar("Level deleted successfully", "success");
      fetchLevels();
      setDeleteDialog({ open: false, level: null });
    } catch (error) {
      console.error("Error deleting level:", error);
      showSnackbar("Failed to delete level", "error");
      setDeleteDialog({ open: false, level: null });
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

      // Special sorting for numeric fields
      if (orderBy === "required_time_in_month") {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }

      if (order === "desc") {
        [valueA, valueB] = [valueB, valueA];
      }

      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    });
  };

  const filterData = (data) => {
    if (!searchTerm) return data;
    
    return data.filter(level => 
      level.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (level.next_level && level.next_level.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const resetForm = () => {
    setFormData({
      level: "",
      next_level: "",
      required_time_in_month: ""
    });
    setFormErrors({});
  };

  const openCreateDialog = () => {
    setIsEditing(false);
    setCurrentLevelId(null);
    resetForm();
    setOpenDialog(true);
  };

  const openEditDialog = (level) => {
    setIsEditing(true);
    setCurrentLevelId(level.id);
    
    setFormData({
      level: level.level,
      next_level: level.next_level || "",
      required_time_in_month: level.required_time_in_month
    });
    
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if any
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!formData.level) errors.level = "Level name is required";
    if (!formData.required_time_in_month) {
      errors.required_time_in_month = "Required time is required";
    } else if (isNaN(Number(formData.required_time_in_month)) || Number(formData.required_time_in_month) < 0) {
      errors.required_time_in_month = "Required time must be a positive number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const formDataToSend = {
        level: formData.level,
        next_level: formData.next_level || null,
        required_time_in_month: Number(formData.required_time_in_month)
      };
      
      if (isEditing) {
        await API.put(`/levels/${currentLevelId}/`, formDataToSend);
        showSnackbar("Level updated successfully", "success");
      } else {
        await API.post("/levels/", formDataToSend);
        showSnackbar("Level created successfully", "success");
      }
      
      setOpenDialog(false);
      fetchLevels();
    } catch (error) {
      console.error("Error saving level:", error);
      const errorMessage = error.response?.data?.detail || "An error occurred while saving the level";
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
    if (loading && levels.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
            <Typography color="error">{error}</Typography>
          </TableCell>
        </TableRow>
      );
    }

    const filteredData = filterData(levels);
    const sortedData = sortData(filteredData);

    if (sortedData.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
            <Typography>No levels found</Typography>
          </TableCell>
        </TableRow>
      );
    }

    return sortedData.map((level) => (
      <TableRow key={level.id}>
        <TableCell>
          <Typography variant="body1" color="primary" fontWeight="medium">
            {level.level}
          </Typography>
        </TableCell>
        <TableCell>{level.next_level || "None"}</TableCell>
        <TableCell>{level.required_time_in_month} months</TableCell>
        <TableCell>
          {new Date(level.created_at).toLocaleString()}
        </TableCell>
        <TableCell>
          <Tooltip title="Edit Level">
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => openEditDialog(level)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Level">
            <IconButton 
              size="small" 
              color="error"
              onClick={() => handleDeleteClick(level)}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Level Management</Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search levels..."
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
            Add New Level
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {renderSortableHeader("level", "Level")}
                {renderSortableHeader("next_level", "Next Level")}
                {renderSortableHeader("required_time_in_month", "Required Time (Months)")}
                {renderSortableHeader("created_at", "Created At")}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderContent()}</TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create/Edit Level Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white", py: 2 }}>
          {isEditing ? "Edit Level" : "Create New Level"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium">Level Information</Typography>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                error={!!formErrors.level}
                helperText={formErrors.level}
                placeholder="e.g., 1-A"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Next Level"
                name="next_level"
                value={formData.next_level}
                onChange={handleInputChange}
                placeholder="e.g., 1-B (leave empty if last level)"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Required Time (Months)"
                name="required_time_in_month"
                value={formData.required_time_in_month}
                onChange={handleInputChange}
                error={!!formErrors.required_time_in_month}
                helperText={formErrors.required_time_in_month}
                type="number"
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
          </Grid>
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
            {loading ? "Saving..." : isEditing ? "Update Level" : "Create Level"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, level: null })}
      >
        <DialogTitle sx={{ bgcolor: "error.main", color: "white" }}>
          Confirm Delete Level
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1, px: 3 }}>
          {deleteDialog.level && (
            <>
              <Typography variant="h6" gutterBottom>
                Are you sure you want to delete this level?
              </Typography>
              <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 1, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Level
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {deleteDialog.level.level}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Next Level
                    </Typography>
                    <Typography variant="body1">
                      {deleteDialog.level.next_level || "None"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Required Time
                    </Typography>
                    <Typography variant="body1">
                      {deleteDialog.level.required_time_in_month} months
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Typography color="error" variant="body2">
                Warning: Deleting this level may affect nurses currently at this level.
                This action cannot be undone.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, level: null })}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={<Delete />}
          >
            Delete Level
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

export default LevelReferencePage;