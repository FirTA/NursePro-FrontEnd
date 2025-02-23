import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import Header from "../layout/Header";

const CareerPath = () => {
  const dummydata = [
    {
      id: 1,
      level: "1-A",
      next_level: "1-B",
      required_time_in_month: 12,
      created_at: "2023-10-01T12:00:00Z",
      update_at: "2023-10-01T12:00:00Z",
    },
    {
      id: 2,
      level: "1-B",
      next_level: "2-A",
      required_time_in_month: 12,
      created_at: "2023-10-01T12:00:00Z",
      update_at: "2023-10-01T12:00:00Z",
    },
    {
      id: 3,
      level: "2-A",
      next_level: "2-B",
      required_time_in_month: 12,
      created_at: "2023-10-01T12:00:00Z",
      update_at: "2023-10-01T12:00:00Z",
    },
    {
      id: 4,
      level: "2-B",
      next_level: "3-A",
      required_time_in_month: 12,
      created_at: "2023-10-01T12:00:00Z",
      update_at: "2023-10-01T12:00:00Z",
    },
    {
      id: 5,
      level: "3-A",
      next_level: "3-B",
      required_time_in_month: 12,
      created_at: "2023-10-01T12:00:00Z",
      update_at: "2023-10-01T12:00:00Z",
    },
    {
      id: 6,
      level: "3-B",
      next_level: null,
      required_time_in_month: 12,
      created_at: "2023-10-01T12:00:00Z",
      update_at: "2023-10-01T12:00:00Z",
    },
  ];

  const columns = [
    { field: "id", headerName: "Id" },
    { field: "level", headerName: "level" },
    { field: "next_level", headerName: "level selanjutnya" },
    {
      field: "required_time_in_month",
      headerName: "waktu yang dibutuhkan (bulan)",
    },
    { field: "created_at", headerName: "created time" },
    { field: "update_at", headerName: "updated time" },
    {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        width: 150,
        renderCell: (params) => console.log(params),
      },
  ];
  return (
    <Box>
      <DataGrid columns={columns} rows={dummydata} checkboxSelection/>
    </Box>
  );
};

export default CareerPath;
