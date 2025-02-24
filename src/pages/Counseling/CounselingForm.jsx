import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid2,
  Paper,
  Divider,
  Avatar,
  InputAdornment,
} from "@mui/material";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isBetween from "dayjs/plugin/isBetween";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
  DateTimePicker,
  StaticDateTimePicker,
} from "@mui/x-date-pickers";
import {
  Delete,
  AttachFile,
  Close as CloseIcon,
  Event,
  Description,
  Category,
} from "@mui/icons-material";
import { API } from "../../api/post";
import { daysInWeek } from "date-fns/constants";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Download, File, FileIcon, SearchIcon, Trash2 } from "lucide-react";

// Initialize dayjs plugins
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id");

const CounselingForm = ({
  open,
  onClose,
  counseling,
  isNewCounseling,
  userRole,
}) => {
  const initialFormData = {
    title: "",
    description: "",
    nurse_ids: [],
    counseling_type: "",
    status: "",
    scheduled_date: dayjs(),
    material_description: "",
    materials_files: [], // Initialize materials_files
    uploaded_files: [], // Initialize uploaded_files
  };

  const [formData, setFormData] = useState(initialFormData);
  const [nurses, setNurses] = useState([]);
  const [selectedNurses, setSelectedNurses] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [nurseSearchTerm, setNurseSearchTerm] = useState("");

  // Get role from props or defaulting
  const isAdmin =
    userRole?.toLowerCase() === "admin" ||
    userRole?.toLowerCase() === "management";
  const isNurse = userRole?.toLowerCase() === "nurse";

  useEffect(() => {
    console.log("CounselingForm opened with:", { open, counseling, userRole });
  }, [open, counseling, userRole]);

  useEffect(() => {
    if (counseling) {
      setFormData({
        ...counseling,
        scheduled_date: counseling.scheduled_date
          ? dayjs(counseling.scheduled_date)
          : dayjs(),
        nurse_ids: counseling.nurses?.map((nurse) => nurse.id) || [],
        materials_files: counseling.materials_files || [],
        uploaded_files: [], // Reset uploaded_files when editing
      });
      setSelectedNurses(counseling.nurses || []);
    } else {
      setFormData(initialFormData);
      setSelectedNurses([]);
    }
    fetchReferenceData();
  }, [counseling]);

  const fetchReferenceData = async () => {
    try {
      const [nursesRes, typesRes, statusesRes] = await Promise.all([
        API.get("/nurses/"),
        API.get("/counseling-types/"),
        API.get("/counseling-status/"),
      ]);
      setNurses(nursesRes.data);
      setTypes(typesRes.data);
      setStatuses(statusesRes.data);
    } catch (error) {
      console.error("Error fetching reference data:", error);
    }
  };

  const handleNurseSelect = (nurseId) => {
    const nurse = nurses.find((n) => n.id === nurseId);
    if (nurse) {
      setSelectedNurses((prev) => [...prev, nurse]);
      setFormData((prev) => ({
        ...prev,
        nurse_ids: [...prev.nurse_ids, nurseId],
      }));
    }
  };

  const handleRemoveNurse = (nurseId) => {
    setSelectedNurses((prev) => prev.filter((nurse) => nurse.id !== nurseId));
    setFormData((prev) => ({
      ...prev,
      nurse_ids: prev.nurse_ids.filter((id) => id !== nurseId),
    }));
  };

  // Get available nurses (not yet selected)
  const availableNurses = nurses.filter(
    (nurse) => !selectedNurses.some((selected) => selected.id === nurse.id)
  );

  const filteredNurses = availableNurses.filter(
    (nurse) =>
      nurse.name.toLowerCase().includes(nurseSearchTerm.toLowerCase()) ||
      (nurse.level &&
        nurse.level.toLowerCase().includes(nurseSearchTerm.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    console.log("Submitting form data:", formData);

    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();

      const dateToSend = formData.scheduled_date
        ? dayjs
            .utc(formData.scheduled_date)
            .tz("Asia/Jakarta")
            .format("YYYY-MM-DDTHH:mm:ss")
        : dayjs.utc().tz("Asia/Jakarta").format("YYYY-MM-DDTHH:mm:ss");

      // Add nurse_ids to form data
      formData.nurse_ids.forEach((nurseId) => {
        formDataToSend.append("nurse_ids", nurseId);
      });

      // Append other fields
      Object.keys(formData).forEach((key) => {
        if (key === "scheduled_date") {
          formDataToSend.append(key, dateToSend);
        } else if (key === "uploaded_files") {
          formData.uploaded_files.forEach((file) => {
            formDataToSend.append("uploaded_files", file);
          });
        } else if (
          key !== "nurse_ids" &&
          key !== "nurses" &&
          key !== "materials_files"
        ) {
          // Skip nurse_ids as we handled it above, and skip arrays/objects that shouldn't be directly appended
          formDataToSend.append(key, formData[key]);
        }
      });

      // Make the API call
      if (counseling) {
        await API.put(`/counseling/${counseling.id}/`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await API.post("/counseling/", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      onClose(true); // Pass true to indicate refresh needed
    } catch (error) {
      console.error("Error saving consultation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // File handling functions
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      uploaded_files: [...(prev.uploaded_files || []), ...newFiles],
    }));
  };

  const removeFile = async (fileId, isExistingFile = true) => {
    if (isExistingFile && counseling) {
      try {
        await API.post(`/counseling/${counseling.id}/remove_file/`, {
          file_id: fileId,
        });
        setFormData((prev) => ({
          ...prev,
          materials_files: (prev.materials_files || []).filter(
            (f) => f.id !== fileId
          ),
        }));
      } catch (error) {
        console.error("Error removing file:", error);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        uploaded_files: (prev.uploaded_files || []).filter(
          (_, index) => index !== fileId
        ),
      }));
    }
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      scheduled_date: newValue ? dayjs(newValue).tz("Asia/Jakarta") : null,
    }));
  };

  const quickTimeSelect = (hours, minutes) => {
    const newDate = dayjs(formData.scheduled_date)
      .hour(hours)
      .minute(minutes)
      .second(0);
    handleDateChange(newDate);
    setDatePickerOpen(false);
  };

  const handleDownload = (filePath) => {
    window.open(filePath, "_blank");
  };

  // Special view for nurses viewing existing counseling sessions
  if (isNurse && counseling) {
    return (
      <Dialog
        open={open}
        onClose={() => onClose()}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            py: 2,
            px: 3,
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: "medium" }}
          >
            {counseling?.title}
          </Typography>
          <Chip
            label={counseling?.status_display}
            color={
              counseling?.status === 1
                ? "success"
                : counseling?.status === 2
                ? "warning"
                : "default"
            }
            size="small"
            sx={{ mt: 1 }}
          />
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Grid2 container spacing={3}>
            {/* Left column - Session details */}
            <Grid2 item xs={12} md={7}>
              <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                  <Description sx={{ mr: 2, color: "text.secondary" }} />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: "medium", color: "text.primary" }}
                    >
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                      {counseling?.description || "No description provided"}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Category sx={{ mr: 2, color: "text.secondary" }} />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: "medium", color: "text.primary" }}
                    >
                      Type
                    </Typography>
                    <Chip
                      label={counseling?.counseling_type_display}
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Event sx={{ mr: 2, color: "text.secondary" }} />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: "medium", color: "text.primary" }}
                    >
                      Scheduled Date
                    </Typography>
                    <Typography variant="body1">
                      {counseling?.scheduled_date
                        ? dayjs(counseling.scheduled_date).format(
                            "DD MMMM YYYY HH:mm"
                          )
                        : "Not scheduled yet"}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid2>

            {/* Right column - Materials */}
            <Grid2 item xs={12} md={5}>
              <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <File sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="h6" component="div">
                    Materials
                  </Typography>
                </Box>

                {counseling?.materials_files?.length > 0 ? (
                  <List>
                    {counseling.materials_files.map((file, index) => (
                      <React.Fragment key={file.id || index}>
                        <ListItem
                          sx={{
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            transition: "all 0.2s",
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                        >
                          <Avatar sx={{ mr: 2, bgcolor: "primary.light" }}>
                            <FileIcon />
                          </Avatar>
                          <ListItemText
                            primary={file.title}
                            secondary={`Added on ${
                              dayjs(file.created_at).format("DD MMM YYYY") ||
                              "Unknown date"
                            }`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => handleDownload(file.file_path)}
                              color="primary"
                              sx={{
                                "&:hover": {
                                  bgcolor: "primary.light",
                                  color: "primary.contrastText",
                                },
                              }}
                            >
                              <Download />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < counseling.materials_files.length - 1 && (
                          <Divider component="li" sx={{ my: 1 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box
                    sx={{
                      py: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      color: "text.secondary",
                      bgcolor: "action.hover",
                      borderRadius: 1,
                    }}
                  >
                    <FileIcon sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
                    <Typography>No materials available</Typography>
                  </Box>
                )}
              </Paper>
            </Grid2>
          </Grid2>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: "background.default" }}>
          <Button onClick={() => onClose()} variant="outlined">
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={counseling?.status === 3} // Disable if counseling status is completed
          >
            Join Session
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Form view for admin/management users (or for creating new sessions)
  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 2,
        }}
      >
        {counseling ? "Edit Counseling Session" : "New Counseling Session"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            margin="normal"
          />

          <TextField
            required
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            margin="normal"
          />

          {/* Selected Nurses Display */}
          <Box sx={{ mb: 2, mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Nurses
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedNurses.map((nurse) => (
                <Chip
                  key={nurse.id}
                  label={nurse.name}
                  onDelete={() => handleRemoveNurse(nurse.id)}
                  deleteIcon={<CloseIcon />}
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
              {selectedNurses.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No nurses selected
                </Typography>
              )}
            </Box>
          </Box>

          <TextField
            fullWidth
            size="small"
            placeholder="Search nurses by name or level..."
            value={nurseSearchTerm}
            onChange={(e) => setNurseSearchTerm(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: nurseSearchTerm ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setNurseSearchTerm("")}
                    edge="end"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />

          {/* Nurse Selection Dropdown - Use filtered results */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Add Nurse</InputLabel>
            <Select
              value=""
              onChange={(e) => handleNurseSelect(e.target.value)}
              displayEmpty
            >
              {filteredNurses.length === 0 ? (
                <MenuItem disabled>
                  {nurseSearchTerm
                    ? "No matching nurses found"
                    : "No more nurses available"}
                </MenuItem>
              ) : (
                filteredNurses.map((nurse) => (
                  <MenuItem key={nurse.id} value={nurse.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <span>{nurse.name}</span>
                      {nurse.level && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 2 }}
                        >
                          {nurse.level}
                        </Typography>
                      )}
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Counseling Type */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.counseling_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  counseling_type: e.target.value,
                }))
              }
            >
              {types.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <DateTimePicker
                label="Scheduled Date"
                value={formData.scheduled_date}
                onChange={handleDateChange}
                slotProps={{
                  textField: { fullWidth: true, margin: "normal" },
                }}
                ampm={false}
                format="DD MMMM YYYY HH:mm"
              />
              <IconButton
                onClick={() => setDatePickerOpen(true)}
                sx={{ ml: 1 }}
              >
                <Event />
              </IconButton>
            </Box>
          </LocalizationProvider>

          {/* Date Picker Dialog */}
          <Dialog
            open={datePickerOpen}
            onClose={() => setDatePickerOpen(false)}
          >
            <DialogContent>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="id"
              >
                <StaticDateTimePicker
                  value={formData.scheduled_date}
                  onChange={handleDateChange}
                  ampm={false}
                  minutesStep={5}
                  timezone="Asia/Jakarta"
                  slotProps={{
                    actionBar: {
                      actions: ["clear", "today", "accept"],
                    },
                  }}
                />
              </LocalizationProvider>
              <Box
                sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
              >
                <Typography variant="subtitle2">Quick Select:</Typography>
                <Button size="small" onClick={() => quickTimeSelect(9, 0)}>
                  9:00
                </Button>
                <Button size="small" onClick={() => quickTimeSelect(12, 0)}>
                  12:00
                </Button>
                <Button size="small" onClick={() => quickTimeSelect(15, 0)}>
                  15:00
                </Button>
                <Button size="small" onClick={() => quickTimeSelect(18, 0)}>
                  18:00
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDatePickerOpen(false)}>Cancel</Button>
              <Button onClick={() => setDatePickerOpen(false)} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>

          {/* Materials Description */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Materials Description"
            value={formData.material_description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                material_description: e.target.value,
              }))
            }
            margin="normal"
          />

          {/* Files section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Materials</Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFile />}
              sx={{ mt: 1 }}
            >
              Upload Files
              <input
                type="file"
                hidden
                multiple
                accept=".pdf"
                onChange={handleFileChange}
              />
            </Button>
            <List>
              {/* Existing files */}
              {(formData.materials_files || []).map((file, index) => (
                <ListItem
                  key={`existing-${file.id}`}
                  sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                >
                  <ListItemText
                    primary={file.title}
                    secondary={file.size_readable || "Unknown size"}
                  />
                  <ListItemSecondaryAction>
                    {file.file_path && (
                      <IconButton
                        edge="end"
                        onClick={() => handleDownload(file.file_path)}
                        disabled={isSubmitting}
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        <Download />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(file.id, true)}
                      disabled={isSubmitting}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}

              {/* Newly uploaded files */}
              {(formData.uploaded_files || []).map((file, index) => (
                <ListItem
                  key={`new-${index}`}
                  sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                >
                  <ListItemText
                    primary={file.name}
                    secondary="Pending upload"
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(index, false)}
                      disabled={isSubmitting}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}

              {/* No files message */}
              {!(formData.materials_files || []).length &&
                !(formData.uploaded_files || []).length && (
                  <ListItem>
                    <ListItemText primary="No files uploaded" />
                  </ListItem>
                )}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, bgcolor: "background.default" }}>
        <Button
          onClick={() => onClose()}
          disabled={isSubmitting}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : counseling ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CounselingForm;
