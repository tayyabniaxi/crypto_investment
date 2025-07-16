import React from 'react';
import './NewPassword.css';
import LoginFrame from "../../../Assets/LoginFrame.svg"

const NewPassword = () => {
  return (
    <div className="new-password-container">
      <div className="new-password-left">
        <div className="form-box">
          <h2>Set New Password</h2>
          <p>Create a Strong New Password to Continue</p>
          <form>
            <label>New Password</label>
            <input type="password" placeholder="Enter your password" />
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm New password" />
            <button type="submit">Save Password</button>
          </form>
        </div>
      </div>
      <div className="new-password-right">
        <img
          src= {LoginFrame}
          alt="illustration"
        />
      </div>
    </div>
  );
};

export default NewPassword;
