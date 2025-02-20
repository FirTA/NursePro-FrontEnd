import "./App.css";

import React from "react";
// import Index from './pages/registration/index'
import Index from "./pages/layout/index";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Routes, Route, Router, Switch } from "react-router-dom";
import { Profile } from "./pages/Profile/Profile";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import SideBar from "./pages/layout/SideBar";
import CounselingList from "./pages/Counseling/CounselingList";
import LoginPage from "./pages/registration/Login";
import CareerPath from "./pages/career/CareerPath";
import CRUDDataGrid from "./pages/career/NurseCarrer";
import Material from "./pages/material/Material";
import NotFoundPage from "./pages/components/NotFoundPage";
import Layout from "./pages/layout/Layout";
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/careerpath" element={<CareerPath />} />
          <Route path="/nurse-career" element={<CRUDDataGrid />} />
          <Route path="/counseling" element={<CounselingList />} />
          <Route path="/counseling" element={<CounselingList />} />
          <Route path="/material" element={<Material />} />
          <Route path="*" element={<NotFoundPage />} />{" "}
          {/* Catch-all for invalid routes */}
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
