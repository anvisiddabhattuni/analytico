import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateAccountPage from "./pages/CreateAccountPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import FacebookDashboardFree from "./pages/FacebookDashboardFree";
import MetaConnectPage from "./pages/MetaConnectPage";
import LoginAnalyticsPage from "./pages/LoginAnalyticsPage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import LoadingPageFacebook from "./pages/LoadingPageFacebook";
import GrowthBotPage from "./pages/GrowthBotPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing + Auth */}
        <Route path="/" element={<SignUpPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/login-analytics" element={<LoginAnalyticsPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Platform selector + Meta connect */}
        <Route path="/login" element={<LogInPage />} />
        <Route path="/meta-connect" element={<MetaConnectPage />} />

        {/* Loading — /loading-instagram kept because OAuth callback redirects here */}
        <Route path="/loading-instagram" element={<LoadingPageFacebook />} />
        <Route path="/loading-facebook" element={<LoadingPageFacebook />} />

        {/* Dashboard */}
        <Route path="/facebook-dash" element={<FacebookDashboardFree />} />
        <Route path="/instagram-dash" element={<FacebookDashboardFree />} />

        {/* GrowthBot */}
        <Route path="/growth-bot" element={<GrowthBotPage />} />
      </Routes>
    </Router>
  );
}

export default App;
