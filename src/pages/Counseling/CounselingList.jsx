import React, { useEffect, useState } from "react";
import CustomTable from "../components/CustomTable";
import { Box, Typography } from "@mui/material";
import { APIRequestWithHeaders } from "../../api/post";
import Header from "../layout/Header";
import { DataGrid } from "@mui/x-data-grid";
// import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids';

const CounselingList = () => {
  const [data, setData] = useState([]);
  // const [columns, setColumns] = useState([])
  // Define Table Columns with Sorting
  const columns = [
    { field: "ID", headername: "id" },
    { field: "title", headername: "name" },
    { field: "description", headername: "email" },
    { field: "management", headername: "phone" },
    { field: "nurse_id", headername: "phone" },
    { field: "scheduled_date", headername: "phone" },
    { field: "consultation_type", headername: "phone" },
    { field: "status", headername: "phone" },
  ];

  const rows = data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    management: row.management,
    nurse_id: row.nurse_id,
    scheduled_date: row.scheduled_date,
    consultation_type: row.consultation_type,
    status: row.status,
  }));

  const onHandleCounselingData = async () => {
    const Response = await APIRequestWithHeaders.get("/consultations/");
    const JSONData = Response.data;
    console.log(JSONData);
    setData(JSONData);
    const columnsJSON = Object.keys(JSONData[0]);
    const dataJSON = Object.values(JSONData);
    console.log(" this colums ", columnsJSON);
    console.log(" this data ", dataJSON);

    // setColumns(columnsJSON)
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    onHandleCounselingData();
  }, []);

  // Action Handlers
  const handleView = (row) => {
    alert(`Viewing: ${row.name}`);
  };

  const handleEdit = (row) => {
    alert(`Editing: ${row.name}`);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
      setData((prevData) => prevData.filter((item) => item.id !== row.id));
    }
  };

  return (
    <Box>
      <Header />

      <Box display="block">
        {/* Table Component */}
        <Box>
          <DataGrid columns={columns} rows={rows} />
        </Box>
      </Box>
    </Box>
  );
};

export default CounselingList;
