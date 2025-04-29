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
import LoadingPageInstagram from "./pages/LoadingPageInstagram";
import LoadingPageTikTok from "./pages/LoadingPageTikTok";
import LoadingPageX from "./pages/LoadingPageX";
import GrowthBotPage from './pages/GrowthBotPage'; // adjust path if needed

function App() {
  return (
    <Router>
      <Routes>
        {/* SignUp + Create Account */}
        <Route path="/" element={<SignUpPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />

        {/* Login Pages */}
        <Route path="/login" element={<LogInPage />} />
        <Route path="/instagram-login" element={<InstagramLogInPage />} />
        <Route path="/login-analytics" element={<LoginAnalyticsPage />} />
        <Route path="/tiktok-login" element={<SignTikTokPage />} />
        <Route path="/x-login" element={<SignXPage />} />

        {/* Loading Pages */}
        <Route path="/loading-instagram" element={<LoadingPageInstagram />} />
        <Route path="/loading-tiktok" element={<LoadingPageTikTok />} />
        <Route path="/loading-x" element={<LoadingPageX />} />

        {/* Dashboard Pages */}
        <Route path="/instagram-dash" element={<InstagramDashFree />} />
        <Route path="/tiktok-dash" element={<TikTokDashboardFree />} />
        <Route path="/x-dash" element={<XDashboardFree />} />
        
        {/* Growth Bot Page */}
        <Route path="/growth-bot" element={<GrowthBotPage />} />
      </Routes>
    </Router>
  );
}

export default App;