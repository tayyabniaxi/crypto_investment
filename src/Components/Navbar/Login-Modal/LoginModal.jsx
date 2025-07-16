import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginModal.css";
import LoginFrame from "../../../Assets/LoginFrame.svg";
import Navbar from "../Navbar";

const LoginModal = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or phone is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-left">
          <h2 className="login-title">Login to Account</h2>
          <p className="login-subtitle">Welcome Back! Let's Grow Your Income</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="label-data">Email, Phone</label>
            <input
              type="text"
              placeholder="Enter your email or phone number"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
            {errors.emailOrPhone && (
              <p className="error-message">{errors.emailOrPhone}</p>
            )}

            <label className="label-data">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-buttonn">
              Login
            </button>

            <div className="register-link">
              Don't have an account? <Link to="/register">Register</Link>
            </div>
          </form>
        </div>

        <div className="login-right">
          <img
            src={LoginFrame}
            alt="Login Illustration"
            className="login-image"
          />
        </div>
      </div>
    </>
  );
};

export default LoginModal;
