import React, { useState, useEffect } from "react";
import { Box, Container, Paper, Typography, Snackbar, Alert } from "@mui/material";
import CounselingList from "./CounselingList";
import CounselingForm from "./CounselingForm";
import useAuth from "../../hooks/useAuth";
import CounselingDetailDialog from "./CounselingDetailDialog";
import { API } from "../../api/post";

const Counseling = () => {
  const { auth } = useAuth(); // Get auth context
  const [selectedCounseling, setSelectedCounseling] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Get user role from auth context
  const userRole = auth?.user?.role?.toLowerCase() || auth?.role?.toLowerCase() || "";
  const isNurse = userRole === "nurse";
  const isManagement = userRole === "management" || userRole === "admin";

  // Handle viewing a counseling session
  const handleViewCounseling = (counseling) => {
    setSelectedCounseling(counseling);
    setViewDialogOpen(true);
  };

  // Handle editing or creating a counseling session
  const handleEditCounseling = (counseling = null) => {
    setSelectedCounseling(counseling); // null for new counseling
    setEditDialogOpen(true);
  };

  // Close view dialog
  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
  };

  // Close edit dialog and refresh list if needed
  const handleCloseEditDialog = (refreshNeeded = false) => {
    setEditDialogOpen(false);
    if (refreshNeeded) {
      setRefreshTrigger((prev) => prev + 1); // Increment to trigger refresh
    }
  };

  // Handle download for materials
  const handleDownload = (filePath) => {
    window.open(filePath, "_blank");
  };

  // Handle marking a counseling session as completed
  const handleMarkAsCompleted = async (counselingId) => {
    try {
      await API.post(`/counseling/${counselingId}/mark-completed/`);
      
      // Show success message
      setSnackbar({
        open: true,
        message: "Counseling session marked as completed",
        severity: "success"
      });
      
      // Refresh the list
      setRefreshTrigger((prev) => prev + 1);
      
      // Close the dialog
      setViewDialogOpen(false);
    } catch (error) {
      console.error("Error marking counseling as completed:", error);
      
      setSnackbar({
        open: true,
        message: "Failed to mark counseling as completed",
        severity: "error"
      });
    }
  };

  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Counseling Sessions
        </Typography>

        <Paper sx={{ p: 0, mb: 4 }}>
          <CounselingList
            onView={handleViewCounseling}
            onEdit={handleEditCounseling}
            refreshTrigger={refreshTrigger}
            userRole={userRole}
          />
        </Paper>

        {/* View Dialog */}
        <CounselingDetailDialog
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
          counseling={selectedCounseling}
          isNurse={isNurse}
          isManagement={isManagement}
          handleDownload={handleDownload}
          handleMarkAsCompleted={handleMarkAsCompleted}
        />

        {/* Edit Dialog */}
        <CounselingForm
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          counseling={selectedCounseling}
          isNewCounseling={!selectedCounseling}
          userRole={userRole}
        />
        
        {/* Snackbar for notifications */}
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
    </Container>
  );
};

export default Counseling;