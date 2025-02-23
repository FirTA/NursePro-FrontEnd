import "./App.css";

import React from "react";
// import Index from './pages/registration/index'
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Routes, Route, Router, Switch } from "react-router-dom";
import ProfilePage, { Profile } from "./pages/Profile/ProfilePage";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/registration/Login";
import CareerPath from "./pages/career/CareerPath";
import CRUDDataGrid from "./pages/career/NurseCarrer";
import Material from "./pages/material/Material";
import NotFoundPage from "./pages/components/NotFoundPage";
import Layout from "./pages/layout/Layout";
import Counseling from "./pages/Counseling/Counseling";
import AuthContainer from "./pages/registration/Loginv2";
import { theme } from "./style/theme/theme";
import ForgotPasswordPage from "./pages/registration/ForgotPasswordPage";
import NurseList from "./pages/Nurse/NurseList";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
        <Route path="/loginv2" element={<AuthContainer/>}/>
        <Route element={<Layout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/careerpath" element={<CareerPath />} />
          <Route path="/nurse-career" element={<CRUDDataGrid />} />
          <Route path="/counseling" element={<Counseling />} />
          <Route path="/nurse-list" element={<NurseList />} />
          <Route path="/material" element={<Material />} />
          <Route path="*" element={<NotFoundPage />} />{" "}
          {/* Catch-all for invalid routes */}
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
