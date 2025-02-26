import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid2,
  FormControlLabel,
  Switch,
  DialogActions,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Close,
  CalendarMonth,
  AccessTime,
} from "@mui/icons-material";
import { API } from "../../api/post";
import { EyeClosedIcon, SaveIcon } from "lucide-react";

const NurseList = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Dialog states
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    fetchNurses();
    fetchDepartments();
    fetchLevels();
  }, []);

  const fetchNurses = async () => {
    try {
      const response = await API.get("/nurses/");
      const data = response.data;
      setNurses(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching nurses:", error);
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await API.get("/departments/");
      const data = response.data;
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await API.get("/levels/");
      const data = await response.data;
      setLevels(data);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleView = (nurse) => {
    setSelectedNurse(nurse);
    setViewDialog(true);
  };

  const handleEdit = (nurse) => {
    setSelectedNurse(nurse);
    setEditFormData(nurse);
    setEditDialog(true);
  };

  const handleSave = async () => {
    try {
      const response = await API.patch(
        `/nurses/${editFormData.id}/`,
        editFormData
      );

      if (response.status === 200) {
        const updatedNurse = response.data;
        setNurses(
          nurses.map((nurse) =>
            nurse.id === updatedNurse.id ? updatedNurse : nurse
          )
        );
        setEditDialog(false);
        // Refresh the data
        fetchNurses();
      }
    } catch (error) {
      console.error("Error updating nurse:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: event.target.type === "checkbox" ? checked : value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return "error";
    if (progress < 70) return "warning";
    return "success";
  };

  const filteredNurses = nurses.filter((nurse) => {
    const matchesSearch =
      nurse.name?.toLowerCase().includes(search.toLowerCase()) ||
      nurse.nurse_account_id?.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      department === "" || nurse.department?.id === department;
    const matchesLevel = level === "" || nurse.current_level?.id === level;
    return matchesSearch && matchesDepartment && matchesLevel;
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  // View Dialog Component
  const ViewDialog = () => (
    <Dialog
      open={viewDialog}
      onClose={() => setViewDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Nurse Details</Typography>
          <IconButton onClick={() => setViewDialog(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2} sx={{ mt: 1 }}>
          <Grid2 item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Nurse ID
            </Typography>
            <Typography variant="body1">
              {selectedNurse?.nurse_account_id}
            </Typography>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Name
            </Typography>
            <Typography variant="body1">{selectedNurse?.name}</Typography>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Department
            </Typography>
            <Typography variant="body1">
              {selectedNurse?.department?.name}
            </Typography>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Level
            </Typography>
            <Typography variant="body1">{selectedNurse?.level}</Typography>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Years of Service
            </Typography>
            <Typography variant="body1">
              {selectedNurse?.years_of_service}
            </Typography>
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Next Level Date
            </Typography>
            <Typography variant="body1">
              {formatDate(selectedNurse?.level_upgrade_date)}
            </Typography>
          </Grid2>

          {/* Added Level Progress Details */}
          <Grid2 item xs={12}>
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Level Progress
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={selectedNurse?.level_progress || 0}
                    color={getProgressColor(selectedNurse?.level_progress || 0)}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {selectedNurse?.level_progress || 0}%
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Box display="flex" alignItems="center">
                  <CalendarMonth
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="caption">
                    Started:{" "}
                    {formatDate(selectedNurse?.current_level_start_date)}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <AccessTime
                    fontSize="small"
                    color="action"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="caption">
                    {selectedNurse?.current_level?.required_time_in_month
                      ? `${selectedNurse.current_level.required_time_in_month} months required`
                      : "Time requirement unknown"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </DialogContent>
    </Dialog>
  );

  // Edit Dialog Component
  const EditDialog = () => (
    <Dialog
      open={editDialog}
      onClose={() => setEditDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit Nurse</Typography>
          <IconButton onClick={() => setEditDialog(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Grid2 container spacing={3}>
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                label="Nurse ID"
                name="nurse_account_id"
                value={editFormData?.nurse_account_id || ""}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            </Grid2>

            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={editFormData?.name || ""}
                onChange={handleChange}
                disabled
              />
            </Grid2>

            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Department"
                name="department"
                value={editFormData?.department?.id || ""}
                onChange={handleChange}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>

            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Level"
                name="current_level"
                value={editFormData?.level || ""}
                onChange={handleChange}
              >
                {levels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>

            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specialization"
                name="specialization"
                value={editFormData?.specialization || ""}
                onChange={handleChange}
              />
            </Grid2>

            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years of Service"
                value={editFormData?.years_of_service || ""}
                disabled
              />
            </Grid2>

            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Next Level Date"
                value={formatDate(editFormData?.level_upgrade_date)}
                disabled
              />
            </Grid2>

            <Grid2 item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editFormData?.is_active || false}
                    onChange={handleChange}
                    name="is_active"
                  />
                }
                label="Active Status"
              />
            </Grid2>

            {/* Level Progress (read-only view) */}
            <Grid2 item xs={12}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Level Progress
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={editFormData?.level_progress || 0}
                    color={getProgressColor(editFormData?.level_progress || 0)}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {editFormData?.level_progress || 0}%
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={() => setEditDialog(false)}
          variant="outlined"
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Nurse List
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 200 }}
            />
            <TextField
              select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              size="small"
              sx={{ width: 200 }}
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              size="small"
              sx={{ width: 200 }}
            >
              <MenuItem value="">All Levels</MenuItem>
              {levels.map((lvl) => (
                <MenuItem key={lvl.id} value={lvl.id}>
                  {lvl.level}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Years of Service</TableCell>
                <TableCell>Level Progress</TableCell>
                <TableCell>Next Level Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNurses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((nurse) => (
                  <TableRow key={nurse.id}>
                    <TableCell>{nurse.nurse_account_id}</TableCell>
                    <TableCell>{nurse.name}</TableCell>
                    <TableCell>{nurse.department?.name}</TableCell>
                    <TableCell>{nurse.level}</TableCell>
                    <TableCell>{nurse.years_of_service}</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>
                      <Tooltip
                        title={`Started: ${formatDate(
                          nurse.current_level_start_date
                        )}`}
                        arrow
                      >
                        <Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={{ flexGrow: 1, width: "100%" }}>
                              <LinearProgress
                                variant="determinate"
                                value={nurse.level_progress || 0}
                                color={getProgressColor(
                                  nurse.level_progress || 0
                                )}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{ whiteSpace: "nowrap" }}
                            >
                              {nurse.level_progress || 0}%
                            </Typography>
                          </Box>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {formatDate(nurse.level_upgrade_date)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={nurse.is_active ? "Active" : "Inactive"}
                        color={nurse.is_active ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleView(nurse)}
                        title="View Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(nurse)}
                        title="Edit Nurse"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredNurses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* Dialogs */}
      <ViewDialog />
      <EditDialog />
    </Box>
  );
};

export default NurseList;
