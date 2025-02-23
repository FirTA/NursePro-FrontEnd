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
} from "@mui/icons-material";
import { API } from "../../api/post";
import { daysInWeek } from "date-fns/constants";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Download, Trash2 } from "lucide-react";
// Initialize dayjs plugins
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale("id");

const ConsultationForm = ({ open, onClose, counseling }) => {
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

  useEffect(() => {
    console.log(counseling);
  }, []);

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
    console.log(selectedNurses);
    console.log(formData);
  };

  // Get available nurses (not yet selected)
  const availableNurses = nurses.filter(
    (nurse) => !selectedNurses.some((selected) => selected.id === nurse.id)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();

      const dateToSend = formData.scheduled_date
        ? dayjs
            .utc(formData.scheduled_date)
            .tz("Asia/Jakarta")
            .format("YYYY-MM-DDTHH:mm:ss")
        : dayjs.utc().tz("Asia/Jakarta").format("YYYY-MM-DDTHH:mm:ss");

      // Important: Remove the forEach and append nurse_ids directly
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
        } else if (key !== "nurse_ids") {
          // Skip nurse_ids as we handled it above
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
      onClose(true);
    } catch (error) {
      console.error("Error saving consultation:", error);
    } finally {
      setIsSubmitting(false);
      setSelectedNurses([]);
      setFormData(initialFormData);
    }
  };

  // Rest of the handlers remain the same...
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

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md" fullWidth>
      <DialogTitle>
        {counseling ? "Edit Consultation" : "New Consultation"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
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
            </Box>
          </Box>

          {/* Nurse Selection Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Add Nurse</InputLabel>
            <Select
              value=""
              onChange={(e) => handleNurseSelect(e.target.value)}
              displayEmpty
            >
              {availableNurses.map((nurse) => (
                <MenuItem key={nurse.id} value={nurse.id}>
                  {nurse.name}
                </MenuItem>
              ))}
              {availableNurses.length === 0 && (
                <MenuItem disabled>No more nurses available</MenuItem>
              )}
            </Select>
          </FormControl>

          {/* Rest of the form fields remain the same */}
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

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <DateTimePicker
                label="Scheduled Date"
                value={formData.scheduled_date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
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

          {/* Files section remains the same */}
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
                  key={`new-${index}`}
                  className="border-b border-gray-200"
                >
                  <ListItemText
                    primary={file.title}
                    secondary={file.size_readable}
                    className="flex-1"
                  />
                  <ListItemSecondaryAction className="flex gap-1">
                    {file.file_path && (
                      <IconButton
                        edge="end"
                        onClick={() => handleDownload(file.file_path)}
                        disabled={isSubmitting}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Download className="h-5 w-5" />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(file.id, true)}
                      disabled={isSubmitting}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}

              {/* Newly uploaded files */}
              {(formData.uploaded_files || []).map((file, index) => (
                <ListItem key={`new-${index}`}>
                  <ListItemText
                    primary={file.name}
                    secondary="Pending upload"
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(file.id, false)}
                      disabled={isSubmitting}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}

              {/* Show "No files uploaded" only when both arrays are empty */}
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
      <DialogActions>
        <Button onClick={() => onClose()} disabled={isSubmitting}>
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

export default ConsultationForm;
