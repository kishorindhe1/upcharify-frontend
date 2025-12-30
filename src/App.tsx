import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import PrivacyPage from "./pages/PrivacyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import TermsPage from "./pages/TermsPage";

import EditUserPage from "./pages/EditUserPage";
import { SuperAdminDashboard } from "./pages/dashboard/SuperAdminDashboard";
import { HospitalCreate } from "./pages/hospitals/CreateHospital";
import { HospitalEdit } from "./pages/hospitals/EditHospital";
import { HospitalList } from "./pages/hospitals/HospitalList";

import { DoctorCreate } from "./pages/doctor/CreateDoctor";
import { DoctorList } from "./pages/doctor/DoctorList";
import { DoctorEdit } from "./pages/doctor/EditDoctor";
import { UserCreate } from "./pages/users/CreateUser";
import { UserList } from "./pages/users/UserList";
import "./styles/index.css";
import { AppointmentList } from "./pages/appointments/AppointmentList";
import { AppointmentCreate } from "./pages/appointments/AppointmentCreate";
import { AppointmentCalendar } from "./pages/appointments/AppointmentCalendar";
import { AppointmentDetails } from "./pages/appointments/AppointmentDetails";
import { AppointmentEdit } from "./pages/appointments/AppointmentEdit";
import { DoctorDetails } from "./pages/doctor/DoctorDetails";
import { UserDetails } from "./pages/users/UserDetails";
import { UserEdit } from "./pages/users/EditUser";
import { HospitalDetails } from "./pages/hospitals/HospitalDetails";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: "#14b8a6",
    colorSuccess: "#10b981",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    colorInfo: "#3b82f6",
    borderRadius: 12,
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  components: {
    Button: {
      controlHeight: 40,
      fontSize: 15,
      fontWeight: 600,
    },
    Input: {
      controlHeight: 44,
      fontSize: 15,
    },
    Select: {
      controlHeight: 44,
      fontSize: 15,
    },
  },
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/super-admin-dashboard" replace />}
              />
              <Route
                path="super-admin-dashboard"
                element={<SuperAdminDashboard />}
              />
              {/* Hospital Routes */}
        <Route path="hospitals">
          <Route index element={<HospitalList />} />
          <Route path="create" element={<HospitalCreate />} />
          <Route path=":id" element={<HospitalDetails />} />
          <Route path=":id/edit" element={<HospitalEdit />} />
        </Route>

        {/* User Routes */}
        <Route path="users">
          <Route index element={<UserList />} />
          <Route path="create" element={<UserCreate />} />
          <Route path=":id" element={<UserDetails />} />
          <Route path=":id/edit" element={<UserEdit />} />
        </Route>
                {/* Doctor Routes */}
        <Route path="doctors">
          <Route index element={<DoctorList />} />
          <Route path="create" element={<DoctorCreate />} />
          <Route path=":id" element={<DoctorDetails />} />
          <Route path=":id/edit" element={<DoctorEdit />} />
        </Route>

         

              <Route path="appointments">
                <Route index element={<AppointmentList />} />
                <Route path="create" element={<AppointmentCreate />} />
                <Route path="calendar" element={<AppointmentCalendar />} />
                <Route path=":id" element={<AppointmentDetails />} />
                <Route path=":id/edit" element={<AppointmentEdit />} />
              </Route>
              <Route
                path="*"
                element={<Navigate to="/super-admin-dashboard" replace />}
              />
            </Route>

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
