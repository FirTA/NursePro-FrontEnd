import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid2,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../layout/Header";
import { API } from "../../api/post";
import { Dot, EditIcon } from "lucide-react";
import { Edit, GetApp } from "@mui/icons-material";
import TimeView from "../components/TimeView";
import SearchBar from "../components/SearchBar";
import EditCounselingMaterialDialog from "../components/EditCounselingMaterialDialog";

const Material = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const dataFiltered = data.filter((i) =>
    i.counseling_title.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
    const result = data.filter((data_) =>
      data_.counseling_title.toLowerCase().includes(search.toLowerCase())
    );
    setData(result);
    console.log(search);
  }, [search]);

  const handleEditClick = (data_) => {
    setCurrentData(data_);
    setEditDialogOpen(true);
  };
  const handleSave = async (updatedData) => {
    try {
      // Handle file uploads
      const formData = new FormData();

      console.log("Number of files to upload:", updatedData.file.length);

      formData.append("description", updatedData.description);
      // Handle both existing files and new files
      const uploadPromises = updatedData.file.map(async (file) => {
        if (file.file) {
          // New file - append directly
          formData.append("file", file.file);
        } else if (file.file_path) {
          // Existing file - fetch and append
          try {
            const response = await fetch(file.file_path);
            const blob = await response.blob();
            const fileName = file.title || file.file_path.split("/").pop();
            formData.append("file", blob, fileName);
          } catch (error) {
            console.error("Error fetching existing file:", error);
          }
        }
      });

      // Wait for all files to be processed
      await Promise.all(uploadPromises);

      // Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      await customEndpoints.update(currentData.id, formData);
      fetchData(); // Refresh the data after update
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await customEndpoints.fetch();
      console.log(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const url = "/counselingmaterial/";



  const handleDocuments = (params) => {
    console.log(params);
    window.open(params, "_blank", "noreferrer");
  };

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
      const result = await API.patch(`${url}${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { data: result };
    },
    delete: async (id) => {
      await API.delete(`${url}${id}/`);
      return { success: true };
    },
  };

  return (
    <Box>
      <Container sx={{ paddingTop: 10 }}>
        <Grid2 container spacing={3} direction={"column"}>
          <Card className="mb-6 ">
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "whitesmoke",
              }}
            >
              <Typography variant="h6">Search Topic</Typography>
              <SearchBar setSearch={setSearch} search={search} />
            </CardContent>
          </Card>
          {dataFiltered.map((data_) => (
            <Grid2 item key={data_.id}>
              <Card elevation={2}>
                <CardHeader
                  title={data_.counseling_title}
                  subheader={
                    <Box>
                      <Typography>{data_.description}</Typography>
                    </Box>
                  }
                  action={
                    <IconButton onClick={() => handleEditClick(data_)}>
                      <Edit /> EDIT
                    </IconButton>
                  }
                ></CardHeader>
                <CardContent>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {data_.file.map((document) => (
                      <Box
                        key={document.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          border: 1,
                          borderColor: "grey.300",
                          p: 1,
                          borderRadius: 2,
                          "&:hover": { bgcolor: "grey.50" },
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {document.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              display="flex"
                              alignItems="center"
                            >
                              {document.size_readable}
                              <Dot />
                              <TimeView time={document.created_at} />
                            </Typography>
                          </CardContent>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => {
                              handleDocuments(document.file_path);
                            }}
                          >
                            <GetApp />
                            Download
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>

      {/* Render EditDialog only if currentData is not null */}
      <EditCounselingMaterialDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSave}
        data={currentData}
      />
    </Box>
  );
};

export default Material;
