import { Button, TextField } from "@mui/material";
import React from "react";

const UploadForm = () => {
  return (
    <form>
      <TextField type="file" />
      <Button variant="contained" color="primary" componenet="span"></Button>
    </form>
  );
};

export default UploadForm;
