import React from 'react';
import './RegisterModal.css';
import LoginFrame from "../../../Assets/LoginFrame.svg"

const RegisterModal = () => {
  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="signup-form-box">
          <h2>Sign Up</h2>
          <p>Build Your Future, One Click at a Time</p>
          <form>
            <label>Email, Phone</label>
            <input type="text" placeholder="Enter your email or phone number" />

            <label>Password</label>
            <input type="password" placeholder="Enter your password" />

            <label>Confirm Password</label>
            <input type="password" placeholder="Enter to confirm password" />

            <label>Payment Screenshot</label>
            <div className="file-upload-box">
              <input type="file" id="payment" />
              <button type="button">Upload file</button>
            </div>

            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
          <p className="login-link">Already have account? <a href="#">Login</a></p>
        </div>
      </div>
      <div className="signup-right">
        <img
          src= {LoginFrame}
          alt="signup illustration"
        />
      </div>
    </div>
  );
};

export default RegisterModal;
