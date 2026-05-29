import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

const LandingPage   = lazy(() => import("./pages/LandingPage"));
const GuestPreview  = lazy(() => import("./pages/GuestPreview/GuestPreview"));
const Dashboard     = lazy(() => import("./pages/Home/Dashboard"));
const InterviewPrep = lazy(() => import("./pages/InterviewPrep/InterviewPrep"));
const ProfilePage   = lazy(() => import("./pages/ProfilePage"));
const InterviewDetails = lazy(() => import("./pages/InterviewPrep/components/InterviewDetails")
);

const App = () => {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px", fontWeight: "600" },
          success: { style: { background: "#ecfdf5", color: "#065f46" } },
          error:   { style: { background: "#fef2f2", color: "#991b1b" } },
        }}
      />

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen text-gray-400 text-lg font-semibold">
          Loading...
        </div>
      }>
        <Routes>
          {/* Public */}
          <Route path="/"        element={<LandingPage />} />
          <Route path="/preview" element={<GuestPreview />} />

          {/* Protected */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard"    element={<Dashboard />} />
            <Route path="/interviewprep" element={<InterviewPrep />} />
            <Route path="/profile"      element={<ProfilePage />} />
        
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;