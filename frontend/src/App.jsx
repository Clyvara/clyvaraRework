import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import TestingPage from "./pages/TestingPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PricingPage from "./pages/PricingPage.jsx";

import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CareplanPage from "./pages/CarePlanPage.jsx";
import LearningPlanPage from "./pages/LearningPlanPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/testing" element={<TestingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pricing" element={<PricingPage />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/careplan" element={<CareplanPage />} />
        <Route path="/learningplan" element={<LearningPlanPage />} />
      </Route>
    </Routes>
  );
}
