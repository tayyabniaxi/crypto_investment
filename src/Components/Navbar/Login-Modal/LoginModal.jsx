import React from "react";
import "./LoginModal.css";
import LoginFrame from "../../../Assets/LoginFrame.svg"
import Navbar from "../Navbar";

const LoginModal = () => {
  return (
    <>
    <Navbar />
    <div className="login-container">
      <div className="login-left">
        <h2 className="login-title">Login to Account</h2>
        <p className="login-subtitle">Welcome Back! Let's Grow Your Income</p>

        <form className="login-form">
          <label className = "label-data">Email, Phone</label>
          <input type="text" placeholder="Enter your email or phone number" />

          <label className = "label-data">Password</label>
          <input type="password" placeholder="Enter your password" />

          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className="login-buttonn">Login</button>

          <div className="register-link">
            don't have an account? <a href="#">Register</a>
          </div>
        </form>
      </div>

      <div className="login-right">
        <img src= {LoginFrame} alt="Login Illustration" className="login-image" />
      </div>
    </div>
    </>
  );
};

export default LoginModal;