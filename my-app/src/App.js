import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage";
import LoadingScreen from "./components/ui/LoadingScreen";

// Route-level code splitting — only the landing page loads eagerly
const CreateAccountPage = lazy(() => import("./pages/CreateAccountPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const FacebookDashboardFree = lazy(() => import("./pages/FacebookDashboardFree"));
const MetaConnectPage = lazy(() => import("./pages/MetaConnectPage"));
const LoginAnalyticsPage = lazy(() => import("./pages/LoginAnalyticsPage"));
const LogInPage = lazy(() => import("./pages/LogInPage"));
const LoadingPageFacebook = lazy(() => import("./pages/LoadingPageFacebook"));
const GrowthBotPage = lazy(() => import("./pages/GrowthBotPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const DataDeletionPage = lazy(() => import("./pages/DataDeletionPage"));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen message="Loading…" />}>
        <Routes>
          {/* Landing + Auth */}
          <Route path="/" element={<SignUpPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/login-analytics" element={<LoginAnalyticsPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Facebook connect */}
          <Route path="/login" element={<LogInPage />} />
          <Route path="/meta-connect" element={<MetaConnectPage />} />

          {/* Loading */}
          <Route path="/loading-facebook" element={<LoadingPageFacebook />} />

          {/* Dashboard */}
          <Route path="/facebook-dash" element={<FacebookDashboardFree />} />

          {/* GrowthBot */}
          <Route path="/growth-bot" element={<GrowthBotPage />} />

          {/* Legal */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/data-deletion" element={<DataDeletionPage />} />

          {/* Unknown paths → landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
