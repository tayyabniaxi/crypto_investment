import React from "react";
import "./ForgotPassword.css";
import LoginFrame from "../../../Assets/LoginFrame.svg";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const navigate = useNavigate();

  const handleSendEmail = (e) => {
    e.preventDefault();
    navigate("/otp");
  };

  return (
    <>
      <Navbar />
      <div className="forget-password-container">
        <div className="left-section">
          <div className="form-box">
            <h2>Forgot Password</h2>
            <p className="subtext">Enter Your Email to Recover Access</p>
            <form onSubmit={handleSendEmail}>
              <div className="form-group">
                <label htmlFor="email">Email, Phone</label>
                <input
                  id="email"
                  type="text"
                  placeholder="Enter your email or phone number"
                />
              </div>
              <button type="submit" className="send-button">
                Send Email
              </button>
            </form>
          </div>
        </div>
        <div className="right-section">
          <img src={LoginFrame} alt="Illustration" />
        </div>
      </div>
    </>
  );
}
