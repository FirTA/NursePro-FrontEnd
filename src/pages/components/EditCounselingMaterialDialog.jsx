import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CardContent,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Dot } from "lucide-react";
import TimeView from "./TimeView";
import { CloudUpload, Delete, GetApp } from "@mui/icons-material";
import { formatSize } from "../../utils/file";

const EditCounselingMaterialDialog = ({ open, onClose, onSave, data }) => {
  const [formData, setFormData] = useState({
    counseling_title: "",
    description: "",
    file: [],
  });

  // Update formData when `data` changes
  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      // Reset formData if data is null or undefined
      setFormData({
        counseling_title: "",
        description: "",
        file: [],
      });
    }
    console.log(formData);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFile = {
        title: file.name,
        file_path: URL.createObjectURL(file),
        file: file,  // Important: store the actual file object
        size_readable: formatSize(file.size)
      };
      setFormData((prev) => ({
        ...prev,
        file: [...prev.file, newFile],
      }));
    }
  };


  const handleSave = () => {
    // console.log(formData);
    onSave(formData);
    onClose();
  };

  const handleFileDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      file: prev.file.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Counseling Material</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Counseling Title"
          name="counseling_title"
          value={formData.counseling_title || ""}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
        />
        <Box sx={{ mt: 2 }}>
          <input
            accept=".pdf, .doc, .docx"
            style={{ display: "none" }}
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUpload />}
            >
              Upload File
            </Button>
          </label>
        </Box>
        {/* File List */}
        <List>
          {formData.file.map((file, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={file.title}
                secondary={file.size_readable || "New File"}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleFileDelete(index)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCounselingMaterialDialog;
