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
  TableSortLabel,
  Tooltip,
  Popover,
} from "@mui/material";
import { Delete, Edit, Visibility, Search } from "@mui/icons-material";
import { formatInTimeZone } from "date-fns-tz";
import { API } from "../../api/post";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Download } from "lucide-react";
import useAuth from "../../hooks/useAuth";
// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id");

const CounselingList = ({ onEdit, onView, refreshTrigger, userRole }) => {
  const { auth } = useAuth();
  const [counseling, setCounseling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("title");
  const [order, setOrder] = useState("asc");
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);

  const isAdmin =
    userRole.toLowerCase() === "admin" ||
    userRole.toLowerCase() === "management";
  const isNurse = userRole.toLowerCase() === "nurse";

  useEffect(() => {
    fetchConsultations();
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [refreshTrigger]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/counseling/");
      setCounseling(response.data || []);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      setError("Failed to load consultations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (consultation) => {
    if (window.confirm("Are you sure you want to delete this consultation?")) {
      try {
        await API.delete(`/counseling/${consultation.id}/`);
        await fetchConsultations();
      } catch (error) {
        console.error("Error deleting consultation:", error);
      }
    }
  };

  // Sorting functions
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      let valueA = a[orderBy];
      let valueB = b[orderBy];

      // Handle nested properties
      if (orderBy === "management") {
        valueA = a.management.name;
        valueB = b.management.name;
      }

      if (order === "desc") {
        [valueA, valueB] = [valueB, valueA];
      }

      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    });
  };

  const formatScheduledDate = (dateString) => {
    if (!dateString) {
      return <span>Not scheduled</span>;
    }

    try {
      // Convert UTC to WIB (UTC+7)
      const date = dayjs(dateString).tz("Asia/Jakarta");
      const formattedDate = date.format("DD MMMM YYYY HH:mm");

      return <span>{formattedDate} WIB</span>;
    } catch (error) {
      console.error("Error formatting date:", error);
      return <span>{dateString}</span>;
    }
  };

  // Search function
  const filterData = (data) => {
    return data.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Hover functions
  const handlePopoverOpen = (event, data) => {
    setAnchorEl(event.currentTarget);
    setHoveredData(data);
    console.log("open nurse");
  };

  const handlePopoverClose = () => {
    setTimeout(() => {
      setAnchorEl(null);
      setHoveredData(null);
    }, 200); // Delay 200ms
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
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    }

    const filteredData = filterData(counseling);
    const sortedData = sortData(filteredData);

    // For nurses, only show counseling sessions they're part of
    const userSpecificData = isNurse
      ? sortedData.filter((session) =>
          session.nurses.some((nurse) => nurse.id === auth.nurse_id)
        )
      : sortedData;

    const handleDownload = (filePath) => {
      window.open(filePath, "_blank");
    };

    return userSpecificData.map((counseling) => (
      <TableRow key={counseling.id}>
        <TableCell>{counseling.title}</TableCell>
        <TableCell>
          {counseling.management.name} - {counseling.management.position}
        </TableCell>
        <TableCell>{counseling.counseling_type_display}</TableCell>
        <TableCell>
          <Chip
            label={counseling.status_display}
            color={counseling.status === 1 ? "primary" : "default"}
          />
        </TableCell>
        <TableCell>{formatScheduledDate(counseling.scheduled_date)}</TableCell>
        <TableCell>
          {counseling.nurses?.map((nurse) => (
            <Chip
              key={nurse.id}
              label={nurse.name}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </TableCell>
        <TableCell>
          <IconButton onClick={() => onView(counseling)}>
            <Visibility />
          </IconButton>
          {isAdmin && (
            <>
              <IconButton onClick={() => onEdit(counseling)}>
                <Edit />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDelete(counseling)}
              >
                <Delete />
              </IconButton>
            </>
          )}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6">
          {isNurse ? "My Counseling Sessions" : "Counseling Sessions"}
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search counseling sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
            }}
          />
          {isAdmin && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onEdit()}
              disabled={loading}
            >
              Add New Counseling Session
            </Button>
          )}
        </Box>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {renderSortableHeader("title", "Title")}
              {renderSortableHeader("management", "Management")}
              {renderSortableHeader("counseling_type_display", "Type")}
              {renderSortableHeader("status_display", "Status")}
              {renderSortableHeader("scheduled_date", "Scheduled Date")}
              <TableCell>Nurses</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderContent()}</TableBody>
        </Table>
      </TableContainer>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            All Nurses
          </Typography>
          {hoveredData?.map((nurse) => (
            <Chip
              key={nurse.id}
              label={nurse.name}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
      </Popover>
    </Paper>
  );
};

export default CounselingList;
