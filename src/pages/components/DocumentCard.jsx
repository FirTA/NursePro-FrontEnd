import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

const DocumentCard = () => {
  return (
    <Box>
      <Card className="mb-6" variant="outlined">
        <CardContent>
          <Typography>Create New Topic</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DocumentCard;
