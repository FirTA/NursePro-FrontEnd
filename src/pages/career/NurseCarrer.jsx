// App.jsx
import React from "react";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { DummyDataService } from "../../data/DummyDataService";
import CRUDDataGrid from "../components/CRUDDataGrid";
import Header from "../layout/Header";
import { API } from "../../api/post";
import { blue, blueGrey } from "@mui/material/colors";

const theme = createTheme();

const NurseCareer = () => {
  const url = "/levels/";
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
    },
    {
      field: "level",
      headerName: "level",
      width: 100,
    },
    {
      field: "next_level",
      headerName: "next level",
      width: 150,
    },
    {
      field: "required_time_in_month",
      headerName: "required time in month",
      width: 200,
    },
  ];

  // Instead of actual API calls, we'll use our dummy service
  const customEndpoints = {
    fetch: async () => {
      const data = await API.get(url);
      return { data };
    },
    create: async (data) => {
      const result = await API.post(url, data);
      return { data: result };
    },
    update: async (id, data) => {
      const result = await API.patch(`${url}${id}/`, data);
      return { data: result };
    },
    delete: async (id) => {
      await API.delete(`${url}${id}/`);
      return { success: true };
    },
  };

  return (
    <Box>
      <Box bgcolor={blue} sx={{ p: 5 }}>
        <Box sx={{ height: "100vh", p: 3 }}>
          <CRUDDataGrid
            title="Referensi Jenjang Karir"
            columns={columns}
            customEndpoints={customEndpoints}
            defaultSort={[{ field: "name", sort: "asc" }]}
            onError={(error) => console.error("Error:", error)}
            onSuccess={(operation) =>
              console.log(`${operation} completed successfully`)
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default NurseCareer;
