import React, { useCallback, useState } from "react";
import { Container, createTheme } from "@mui/material";
import CounselingList from "./CounselingList";
import CounselingForm from "./CounselingForm";

const Counseling = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCounseling, setSelectedCounseling] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (counseling = null) => {
    console.log(counseling);
    setSelectedCounseling(counseling);
    setFormOpen(true);
  };
  // Trigger refresh by incrementing the refreshTrigger
  const refreshList = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleView = (counseling = null) => {
    console.log(counseling);
    setSelectedCounseling(counseling);
    setFormOpen(true);
  };

  const handleClose = (refresh = false) => {
    setFormOpen(false);
    setSelectedCounseling(null);
    if (refresh) {
      refreshList();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <CounselingList
        onEdit={handleEdit}
        onView={handleView}
        refreshTrigger={refreshTrigger}
      />
      <CounselingForm
        open={formOpen}
        onClose={handleClose}
        counseling={selectedCounseling}
      />
    </Container>
  );
};

export default Counseling;
