// src/pages/LoginHistoryPage.jsx
import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  TextField,
  TableSortLabel,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  IconButton,
} from "@mui/material";
import { 
  Search, 
  FilterList,
  History as HistoryIcon,
  ClearAll as ClearAllIcon
} from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { API } from "../../api/post";

const LoginHistoryPage = () => {
  const [loginHistory, setLoginHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState("login_time");
  const [order, setOrder] = useState("desc");
  const [users, setUsers] = useState([]);
  
  // Filters
  const [filters, setFilters] = useState({
    userId: "",
    status: "",
    startDate: null,
    endDate: null,
    searchTerm: ""
  });

  useEffect(() => {
    fetchLoginHistory();
    fetchUsers();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters, loginHistory]);

  const fetchLoginHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/admin/login-history/");
      setLoginHistory(response.data || []);
      setFilteredHistory(response.data || []);
    } catch (error) {
      console.error("Error fetching login history:", error);
      setError("Failed to load login history");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get("/admin/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      let valueA, valueB;
      
      // Handle complex properties
      if (orderBy === "user") {
        valueA = a.user?.username || "";
        valueB = b.user?.username || "";
      } else if (orderBy === "duration") {
        // For duration, we'll sort by the raw duration in seconds
        const durationA = calculateDurationInSeconds(a.login_time, a.logout_time);
        const durationB = calculateDurationInSeconds(b.login_time, b.logout_time);
        valueA = durationA;
        valueB = durationB;
      } else {
        valueA = a[orderBy];
        valueB = b[orderBy];
      }

      // Reverse if descending order
      if (order === "desc") {
        [valueA, valueB] = [valueB, valueA];
      }

      // Compare values
      if (valueA === null) return 1;
      if (valueB === null) return -1;
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB);
      }
      
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    });
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      userId: "",
      status: "",
      startDate: null,
      endDate: null,
      searchTerm: ""
    });
  };

  const applyFilters = () => {
    let filtered = [...loginHistory];
    const { userId, status, startDate, endDate, searchTerm } = filters;

    // Filter by user
    if (userId) {
      filtered = filtered.filter(log => log.user?.id.toString() === userId);
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter(log => log.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by start date
    if (startDate) {
      const startDateObj = dayjs(startDate).startOf('day');
      filtered = filtered.filter(log => {
        const logDate = dayjs(log.login_time);
        return logDate.isAfter(startDateObj) || logDate.isSame(startDateObj);
      });
    }

    // Filter by end date
    if (endDate) {
      const endDateObj = dayjs(endDate).endOf('day');
      filtered = filtered.filter(log => {
        const logDate = dayjs(log.login_time);
        return logDate.isBefore(endDateObj) || logDate.isSame(endDateObj);
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.device_info?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
  };

  const calculateDurationInSeconds = (loginTime, logoutTime) => {
    if (!loginTime || !logoutTime) return 0;
    
    const start = dayjs(loginTime);
    const end = dayjs(logoutTime);
    return end.diff(start, 'second');
  };

  const formatDuration = (loginTime, logoutTime) => {
    if (!loginTime) return "N/A";
    if (!logoutTime) return "Active Session";
    
    const start = dayjs(loginTime);
    const end = dayjs(logoutTime);
    const diffSeconds = end.diff(start, 'second');
    
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatDateTime = (dateString) => {
    return dayjs(dateString).format("DD MMM YYYY HH:mm:ss");
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
    if (loading && loginHistory.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
            <Typography color="error">{error}</Typography>
          </TableCell>
        </TableRow>
      );
    }

    const sortedData = sortData(filteredHistory);

    if (sortedData.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
            <Typography>No login history found</Typography>
          </TableCell>
        </TableRow>
      );
    }

    return sortedData.map((log) => (
      <TableRow key={log.id}>
        <TableCell>{log.id}</TableCell>
        <TableCell>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {log.user?.username || "Unknown"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {log.user?.email || ""}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{formatDateTime(log.login_time)}</TableCell>
        <TableCell>
          {log.logout_time ? formatDateTime(log.logout_time) : "Still Active"}
        </TableCell>
        <TableCell>{formatDuration(log.login_time, log.logout_time)}</TableCell>
        <TableCell>{log.ip_address}</TableCell>
        <TableCell sx={{ maxWidth: 200 }}>
          <Tooltip title={log.device_info || "No device info"}>
            <Typography noWrap variant="body2">
              {log.device_info || "No device info"}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Chip
            label={log.status}
            color={log.status === "success" ? "success" : "error"}
            size="small"
          />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">
          <HistoryIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Login History
        </Typography>
      </Box>

      {/* Filters Panel */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1" display="flex" alignItems="center">
            <FilterList sx={{ mr: 1 }} />
            Filters
          </Typography>
          <Tooltip title="Reset all filters">
            <IconButton onClick={resetFilters} size="small">
              <ClearAllIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search users, IP, device..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: "action.active", mr: 1 }} fontSize="small" />,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>User</InputLabel>
              <Select
                value={filters.userId}
                onChange={(e) => handleFilterChange("userId", e.target.value)}
                label="User"
              >
                <MenuItem value="">All Users</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id.toString()}>
                    {user.username} ({user.first_name} {user.last_name})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => handleFilterChange("startDate", date)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => handleFilterChange("endDate", date)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">
            {filteredHistory.length} {filteredHistory.length === 1 ? "Record" : "Records"} Found
          </Typography>
        </Box>
        
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width="5%">ID</TableCell>
                {renderSortableHeader("user", "User")}
                {renderSortableHeader("login_time", "Login Time")}
                {renderSortableHeader("logout_time", "Logout Time")}
                {renderSortableHeader("duration", "Duration")}
                {renderSortableHeader("ip_address", "IP Address")}
                <TableCell>Device Info</TableCell>
                {renderSortableHeader("status", "Status")}
              </TableRow>
            </TableHead>
            <TableBody>{renderContent()}</TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default LoginHistoryPage;