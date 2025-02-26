import "./App.css";

import React from "react";
// import Index from './pages/registration/index'
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfilePage from "./pages/Profile/ProfilePage";
import Dashboard from "./pages/Dashboard/Dashboard";
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
import SessionNotesPage from "./pages/Notes/SessionNotesPage";
import RequireRole from "./pages/components/RequireRole";
import CounselingNotesManagementView from "./pages/Notes/CounselingNotesManagementView";
import AdminUsersPage from "./pages/manage/AdminUsersPage";
import LoginHistoryPage from "./pages/manage/LoginHistoryPage";
import LevelReferencePage from "./pages/level/LevelReferencesPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/loginv2" element={<AuthContainer />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/careerpath" element={<CareerPath />} />
          <Route path="/nurse-career" element={<CRUDDataGrid />} />
          <Route path="/counseling" element={<Counseling />} />
          <Route path="/nurse-list" element={<NurseList />} />
          <Route path="/material" element={<Material />} />
          <Route path="/user-manage" element={<AdminUsersPage />} />
          <Route path="/login-history" element={<LoginHistoryPage/>}/>
          <Route path="/levels" element={<LevelReferencePage/>}/>

          {/* Session Notes Routes */}
          <Route path="/session-notes">
            {/* For nurses - individual notes */}
            <Route
              path=""
              element={
                <RequireRole roles={["nurse"]}>
                  <SessionNotesPage />
                </RequireRole>
              }
            />

            {/* For management - grouped by counseling session */}
            <Route
              path="by-counseling"
              element={
                <RequireRole roles={["management", "admin"]}>
                  <CounselingNotesManagementView />
                </RequireRole>
              }
            />
          </Route>{" "}
          <Route path="*" element={<NotFoundPage />} />{" "}
          {/* Catch-all for invalid routes */}
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
