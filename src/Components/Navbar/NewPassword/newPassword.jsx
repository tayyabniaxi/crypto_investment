import React, { useState } from "react";
import logo from "../../../Assets/icon.png";

export default function NewPasswordModal({ onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Password reset successfully!");
    onClose();
  };

  return (
    <div className="fp-modal-overlay">
      <div className="fp-modal-container">
        <div className="fp-modal-content">
          <div className="fp-modal-header">
            <img src={logo} alt="logo" />
            <button onClick={onClose}>✕</button>
          </div>

          <div className="fp-modal-title">
            <h2>Set New Password</h2>
          </div>
          <div className="fp-form-container">
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="fp-form-input"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="fp-form-input"
            />
            <button onClick={handleReset} className="fp-submit-btn">
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
