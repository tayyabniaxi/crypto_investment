import React, { useState } from "react";
import animgAg from "../../../Assets/icon.png";
import "./otpModal.css";

export default function OtpModal(props) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onVerify(otp);
  };

  return (
    <div className="fp-modal-overlay">
      <div className="fp-modal-container">
        <div className="fp-modal-content">
          <div className="fp-modal-header">
            <img src={animgAg} alt="company-logo" className="fp-logo-img" />
            <button className="fp-close-btn" onClick={props.onClose}>
              ✕
            </button>
          </div>

          <div className="fp-modal-title">
            <h2 className="fp-subtitle-text">Enter OTP</h2>
          </div>

          <div className="fp-modal-subtitle">
            <p className="fp-subtitle-text">
              Enter the 6-Digit Code We Just Sent You
            </p>
          </div>

          <form onSubmit={handleSubmit} className="fp-form-container">
            <div className="fp-input-group">
              <input
                type="text"
                id="otp-input"
                className="fp-form-input"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                pattern="\d{6}"
                required
              />
            </div>

            <button type="submit" className="fp-submit-btn">
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
