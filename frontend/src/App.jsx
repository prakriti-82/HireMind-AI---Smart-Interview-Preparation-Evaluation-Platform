import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import GuestPreview from "./pages/GuestPreview/GuestPreview";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import ProfilePage from "./pages/ProfilePage";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

const App = () => {
  return (
    <Router>
      <Toaster />

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
      <Route path="/preview" element={<GuestPreview />} />
        {/* Protected with shared layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interviewprep" element={<InterviewPrep />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* ✅ FIXED */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;