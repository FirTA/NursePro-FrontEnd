// src/pages/AdminUsersPage.jsx
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
  Chip,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableSortLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  FormHelperText,
  Snackbar,
  Alert,
  Switch,
} from "@mui/material";
import {
  Delete,
  Edit,
  Visibility,
  Search,
  Person,
  Add as AddIcon,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { API } from "../../api/post";
import useAuth from "../../hooks/useAuth";

const AdminUsersPage = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("username");
  const [order, setOrder] = useState("asc");
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);

  // Form state
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    confirm_password: "",
    role: "",
    userType: "nurse", // Default to nurse
    department: "",
    level: "",
    nurse_account_id: "",
    management_account_id: "",
    specialization: "",
    position: "",
    hire_date: dayjs(),
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    userId: null,
    currentStatus: false,
    title: "",
    message: "",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    user: null,
  });

  useEffect(() => {
    fetchUsers();
    fetchReferenceData();
  }, []);

  const fetchReferenceData = async () => {
    try {
      const [rolesRes, departmentsRes, levelsRes] = await Promise.all([
        API.get("/roles/"),
        API.get("/departments/"),
        API.get("/levels/"),
      ]);
      setRoles(rolesRes.data);
      setDepartments(departmentsRes.data);
      setLevels(levelsRes.data);
    } catch (error) {
      console.error("Error fetching reference data:", error);
      showSnackbar("Failed to load reference data", "error");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/admin/users/");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
      showSnackbar("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteDialog({
      open: true,
      user,
    });
  };

  const handleDelete = async () => {
    try {
      const { user } = deleteDialog;
      await API.delete(`/admin/users/${user.id}/`);
      showSnackbar("User deleted successfully", "success");
      fetchUsers();
      setDeleteDialog({ open: false, user: null });
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar("Failed to delete user", "error");
      setDeleteDialog({ open: false, user: null });
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

      // Handle nested properties or special cases
      if (orderBy === "role") {
        valueA = a.role_name || "";
        valueB = b.role_name || "";
      } else if (orderBy === "department") {
        valueA = a.department?.name || a.department?.name || "";
        valueB = b.department?.name || b.department?.name || "";
      } else if (orderBy === "fullName") {
        valueA = `${a.first_name} ${a.last_name}`;
        valueB = `${b.first_name} ${b.last_name}`;
      }

      if (order === "desc") {
        [valueA, valueB] = [valueB, valueA];
      }

      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    });
  };

  const filterData = (data) => {
    if (!searchTerm) return data;

    return data.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.role?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      password: "",
      confirm_password: "",
      role: "",
      userType: "nurse",
      department: "",
      level: "",
      nurse_account_id: "",
      management_account_id: "",
      specialization: "",
      position: "",
      hire_date: dayjs(),
    });
    setFormErrors({});
  };

  const openCreateDialog = () => {
    setIsEditing(false);
    setCurrentUserId(null);
    resetForm();
    setOpenDialog(true);
  };

  const openEditDialog = (user) => {
    setIsEditing(true);
    setCurrentUserId(user.id);

    // Determine user type
    const userType = user.nurse_details
      ? "nurse"
      : user.management_details
      ? "management"
      : "";

    const userData = {
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || "",
      password: "",
      confirm_password: "",
      role: user.role || "",
      userType,
      department: user.department?.name || "",
      level: "",
      nurse_account_id: "",
      management_account_id: "",
      specialization: "",
      position: "",
      hire_date: dayjs(),
    };

    // Add specific fields based on user type
    if (userType === "nurse" && user.nurse_details) {
      userData.nurse_account_id = user.nurse_details.nurse_account_id;
      userData.level = user.nurse_details.current_level?.id || "";
      userData.specialization = user.nurse_details.specialization || "";
      userData.hire_date = user.nurse_details.hire_date
        ? dayjs(user.nurse_details.hire_date)
        : dayjs();
    } else if (userType === "management" && user.management_details) {
      userData.management_account_id =
        user.management_details.management_account_id;
      userData.position = user.management_details.position || "";
    }

    setFormData(userData);
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if any
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      hire_date: newValue,
    }));

    // Clear error for this field if any
    if (formErrors.hire_date) {
      setFormErrors((prev) => ({ ...prev, hire_date: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.username) errors.username = "Username is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.first_name) errors.first_name = "First name is required";
    if (!formData.last_name) errors.last_name = "Last name is required";
    if (!formData.role) errors.role = "Role is required";

    // Password validation for new users
    if (!isEditing) {
      if (!formData.password) errors.password = "Password is required";
      if (!formData.confirm_password)
        errors.confirm_password = "Please confirm your password";
      if (formData.password !== formData.confirm_password) {
        errors.password = "Passwords do not match";
        errors.confirm_password = "Passwords do not match";
      }
    } else if (
      formData.password &&
      formData.password !== formData.confirm_password
    ) {
      errors.password = "Passwords do not match";
      errors.confirm_password = "Passwords do not match";
    }

    // User type specific validations
    if (formData.userType === "nurse") {
      if (!formData.nurse_account_id)
        errors.nurse_account_id = "Nurse Account ID is required";
      if (!formData.department) errors.department = "Department is required";
      if (!formData.level) errors.level = "Level is required";
      if (!formData.hire_date) errors.hire_date = "Hire date is required";
    } else if (formData.userType === "management") {
      if (!formData.management_account_id)
        errors.management_account_id = "Management Account ID is required";
      if (!formData.department) errors.department = "Department is required";
      if (!formData.position) errors.position = "Position is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const formDataToSend = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: formData.role,
        userType: formData.userType,
      };

      // Only include password if provided (required for new users)
      if (formData.password) {
        formDataToSend.password = formData.password;
      }

      // Add user type specific fields
      if (formData.userType === "nurse") {
        formDataToSend.nurse_account_id = formData.nurse_account_id;
        formDataToSend.department = formData.department;
        formDataToSend.level = formData.level;
        formDataToSend.specialization = formData.specialization;
        formDataToSend.hire_date = formData.hire_date.format("YYYY-MM-DD");
      } else if (formData.userType === "management") {
        formDataToSend.management_account_id = formData.management_account_id;
        formDataToSend.department = formData.department.id;
        formDataToSend.position = formData.position;
      }

      if (isEditing) {
        await API.put(`/admin/users/${currentUserId}/`, formDataToSend);
        showSnackbar("User updated successfully", "success");
      } else {
        await API.post("/admin/users/", formDataToSend);
        showSnackbar("User created successfully", "success");
      }

      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      const errorMessage =
        error.response?.data?.detail ||
        "An error occurred while saving the user";
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginStatusClick = (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? "connect" : "disconnect";

    setConfirmDialog({
      open: true,
      userId,
      currentStatus,
      title: `Confirm Login Status Change`,
      message: `Are you sure you want to ${action} this user? ${
        !newStatus ? "This may interrupt their current session." : ""
      }`,
    });
  };

  const toggleLoginStatus = async () => {
    try {
      const { userId, currentStatus } = confirmDialog;

      await API.patch(`/admin/users/${userId}/`, {
        is_login: !currentStatus,
      });

      showSnackbar(`User login status updated successfully`, "success");
      fetchUsers(); // Refresh the user list
      setConfirmDialog({ ...confirmDialog, open: false });
    } catch (error) {
      console.error("Error updating login status:", error);
      showSnackbar("Failed to update login status", "error");
      setConfirmDialog({ ...confirmDialog, open: false });
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

  const getUserTypeChip = (user) => {
    if (user.nurse_details) {
      return <Chip label="Nurse" color="primary" size="small" />;
    } else if (user.management_details) {
      return <Chip label="Management" color="secondary" size="small" />;
    } else {
      return <Chip label="Admin" color="default" size="small" />;
    }
  };

  const renderContent = () => {
    if (loading && users.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
            <Typography color="error">{error}</Typography>
          </TableCell>
        </TableRow>
      );
    }

    const filteredData = filterData(users);
    const sortedData = sortData(filteredData);

    if (sortedData.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
            <Typography>No users found</Typography>
          </TableCell>
        </TableRow>
      );
    }

    return sortedData.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.username}</TableCell>
        <TableCell>
          {user.first_name} {user.last_name}
        </TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role_name || "No Role"}</TableCell>
        <TableCell>{getUserTypeChip(user)}</TableCell>
        <TableCell>{user.department?.name || "N/A"}</TableCell>
        <TableCell>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={user.is_login}
                onChange={() => handleLoginStatusClick(user.id, user.is_login)}
                color="primary"
              />
            }
            label={user.is_login ? "Online" : "Offline"}
          />
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            color="primary"
            onClick={() => openEditDialog(user)}
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteClick(user)}
            disabled={user.id === auth.user_id} // Prevent deleting own account
          >
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5">User Management</Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search users..."
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
            Add New User
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {renderSortableHeader("username", "Username")}
                {renderSortableHeader("fullName", "Full Name")}
                {renderSortableHeader("email", "Email")}
                {renderSortableHeader("role", "Role")}
                <TableCell>Type</TableCell>
                {renderSortableHeader("department", "Department")}
                <TableCell>Login Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderContent()}</TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create/Edit User Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white", py: 2 }}>
          {isEditing ? "Edit User" : "Create New User"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium">
                Basic Information
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                error={!!formErrors.first_name}
                helperText={formErrors.first_name}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                error={!!formErrors.last_name}
                helperText={formErrors.last_name}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.role} required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Role"
                >
                  <MenuItem value="">Select a role</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.role && (
                  <FormHelperText>{formErrors.role}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`Password ${
                  isEditing ? "(Leave blank to keep current)" : ""
                }`}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required={!isEditing}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                error={!!formErrors.confirm_password}
                helperText={formErrors.confirm_password}
                required={!isEditing}
              />
            </Grid>

            {/* User Type Selection */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                User Type
              </Typography>
              <Divider sx={{ my: 1 }} />
              <RadioGroup
                row
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="nurse"
                  control={<Radio />}
                  label="Nurse"
                />
                <FormControlLabel
                  value="management"
                  control={<Radio />}
                  label="Management"
                />
              </RadioGroup>
            </Grid>

            {/* User Type Specific Fields */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {formData.userType === "nurse"
                  ? "Nurse Details"
                  : "Management Details"}
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Common field: Department */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.department} required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  label="Department"
                >
                  <MenuItem value="">Select a department</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.department && (
                  <FormHelperText>{formErrors.department}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Nurse-specific fields */}
            {formData.userType === "nurse" && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nurse Account ID"
                    name="nurse_account_id"
                    value={formData.nurse_account_id}
                    onChange={handleInputChange}
                    error={!!formErrors.nurse_account_id}
                    helperText={formErrors.nurse_account_id}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!formErrors.level} required>
                    <InputLabel>Level</InputLabel>
                    <Select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      label="Level"
                    >
                      <MenuItem value="">Select a level</MenuItem>
                      {levels.map((level) => (
                        <MenuItem key={level.id} value={level.id}>
                          {level.level}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.level && (
                      <FormHelperText>{formErrors.level}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Hire Date"
                      value={formData.hire_date}
                      onChange={handleDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: !!formErrors.hire_date,
                          helperText: formErrors.hire_date,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            )}

            {/* Management-specific fields */}
            {formData.userType === "management" && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Management Account ID"
                    name="management_account_id"
                    value={formData.management_account_id}
                    onChange={handleInputChange}
                    error={!!formErrors.management_account_id}
                    helperText={formErrors.management_account_id}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    error={!!formErrors.position}
                    helperText={formErrors.position}
                    required
                  />
                </Grid>
              </>
            )}
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
            {loading ? "Saving..." : isEditing ? "Update User" : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Dialog for Login Status */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle sx={{ color: "warning.main" }}>
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={toggleLoginStatus}
            color="warning"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
      >
        <DialogTitle sx={{ bgcolor: "error.main", color: "white" }}>
          Confirm Delete User
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1, px: 3 }}>
          {deleteDialog.user && (
            <>
              <Typography variant="h6" gutterBottom>
                Are you sure you want to delete this user?
              </Typography>
              <Box
                sx={{
                  bgcolor: "background.paper",
                  p: 2,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Username
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {deleteDialog.user.username}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {deleteDialog.user.first_name}{" "}
                      {deleteDialog.user.last_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {deleteDialog.user.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Role
                    </Typography>
                    <Typography variant="body1">
                      {deleteDialog.user.role_name}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Typography color="error" variant="body2">
                This action cannot be undone. All user data will be permanently
                removed.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, user: null })}
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
            Delete User
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

export default AdminUsersPage;
