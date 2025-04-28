import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateAccountPage from "./pages/CreateAccountPage";
import InstagramDashFree from "./pages/InstagramDashFree";
import InstagramLogInPage from "./pages/InstagramLogInPage";
import LoginAnalyticsPage from "./pages/LoginAnalyticsPage";
import LogInPage from "./pages/LogInPage";
import SignTikTokPage from "./pages/SignTikTokPage";
import SignUpPage from "./pages/SignUpPage";
import SignXPage from "./pages/SignXPage";
import TikTokDashboardFree from "./pages/TikTokDashboardFree";
import XDashboardFree from "./pages/XDashboardFree";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/instagram-login" element={<InstagramLogInPage />} />
        <Route path="/login-analytics" element={<LoginAnalyticsPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/tiktok-login" element={<SignTikTokPage />} />
        <Route path="/x-login" element={<SignXPage />} />
        <Route path="/instagram-dash" element={<InstagramDashFree />} />
        <Route path="/tiktok-dash" element={<TikTokDashboardFree />} />
        <Route path="/x-dash" element={<XDashboardFree />} />
      </Routes>
    </Router>
  );
}

export default App;