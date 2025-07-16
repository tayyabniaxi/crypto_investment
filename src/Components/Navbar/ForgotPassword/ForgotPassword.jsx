import React, { useState } from "react";
import animgAg from "../../../Assets/icon.png";
import "./ForgotPassword.css";

export default function ForgotPasswordModal(props) {
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const isValidInput = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    return emailRegex.test(input) || phoneRegex.test(input);
  };

  const handleSubmit = () => {
    if (isValidInput(emailOrPhone)) {
      props.onSwitchToOTP(emailOrPhone);
    } else {
      alert("Please enter a valid email or phone number.");
    }
  };

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <div className="forgot-password-header">
            <img src={animgAg} alt="an-image" />
            <button onClick={props.onClose}>X</button>
          </div>
          <div className="forgot-password-title">
            <p className="main-title">Forgot Password</p>
          </div>
          <div className="forgot-password-subtitle">
            <p>Enter Your Email to Recover Access</p>
          </div>
          <div className="forgot-password-form">
            <div className="form-input-group">
              <label>Email, Phone</label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Enter your email or phone number"
              />
            </div>
            <div className="submit-button-container">
              <button onClick={handleSubmit}>Send OTP</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
