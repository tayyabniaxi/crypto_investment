import React from "react";
import "./otpModal.css";
import LoginFrame from "../../../Assets/LoginFrame.svg";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

const OtpModal = () => {
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate("/new-password");
  };

  return (
    <>
      <Navbar />
      <div className="otp-container">
        <div className="otp-left">
          <div className="otp-box">
            <h2 className="otp-title">Enter OTP</h2>
            <p className="otp-subtitle">
              Enter the 6-Digit Code We Just Sent You
            </p>

            <div className="otp-input-group">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  className="otp-input"
                />
              ))}
            </div>

            <button className="verify-btn" onClick={handleVerify}>
              Verify OTP
            </button>
          </div>
        </div>

        <div className="otp-right">
          <img src={LoginFrame} alt="OTP Illustration" className="otp-image" />
        </div>
      </div>
    </>
  );
};

export default OtpModal;
