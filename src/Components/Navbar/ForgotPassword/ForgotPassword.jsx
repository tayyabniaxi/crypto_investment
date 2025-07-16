import React from "react";
import "./ForgotPassword.css";
import LoginFrame from "../../../Assets/LoginFrame.svg"; 
import Navbar from "../Navbar"

export default function ForgetPassword() {
  return (
    <>
    <Navbar />
    <div className="forget-password-container">
      <div className="left-section">
        <div className="form-box">
          <h2>Forgot Password</h2>
          <p className="subtext">Enter Your Email to Recover Access</p>
          <label htmlFor="email">Email, Phone</label>
          <input
            id="email"
            type="text"
            placeholder="Enter your email or phone number"
          />
          <button className="send-button">Send Email</button>
        </div>
      </div>
      <div className="right-section">
        <img src={LoginFrame} alt="Illustration" />
      </div>
    </div>
    </>
  );
}
