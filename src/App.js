import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import HomePage from "./Components/HomePage";
import LoginModal from "./Components/Navbar/Login-Modal/LoginModal";
import ForgetPassword from "./Components/Navbar/ForgotPassword/ForgotPassword.jsx";
import RegisterModal from "./Components/Navbar/RegisterModal/RegisterModal.jsx";
import NewPassword from "./Components/Navbar/NewPassword/NewPassword.jsx";
import Dashboard from "./Components/dashboard/dashboard.jsx";
import AdminPanel from "./Components/Admin/AdminPanel.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginModal />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/register" element={<RegisterModal />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
