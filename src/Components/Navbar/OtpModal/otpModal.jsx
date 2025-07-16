import React from "react";
import "./OtpModal.css";
import LoginFrame from "../../../Assets/LoginFrame.svg"; 
import Navbar from "../Navbar"

const OtpModal = () => {
  return (
    <>
    <Navbar />
    <div className="otp-container">
      <div className="otp-left">
        <div className="otp-box">
          <h2 className="otp-title">Enter OTP</h2>
          <p className="otp-subtitle">Enter the 6-Digit Code We Just Sent You</p>

          <div className="otp-input-group">
            {[...Array(6)].map((_, i) => (
              <input key={i} type="text" maxLength="1" className="otp-input" />
            ))}
          </div>

          <button className="verify-btn">Verify OTP</button>
        </div>
      </div>

      <div className="otp-right">
        <img src={LoginFrame} alt="OTP Illustration" className="otp-image" />
      </div>
    </div>
    </>
  )
};

export default OtpModal;
