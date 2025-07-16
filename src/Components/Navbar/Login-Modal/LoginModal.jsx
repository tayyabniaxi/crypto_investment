import React from "react";
import animgAg from "../../../Assets/icon.png";
import "./LoginModal.css";

export default function LoginModal(props) {
  return (
    <div className="modal-overlay">
      <div className="main-div-inside">
        <div className="Modal-inside-data">
          <div className="upper-sector">
            <img src={animgAg} alt="an-image" />
            <button onClick={props.onClose}>X</button>
          </div>
          <div className="headings">
            <p id="one">Login to Account</p>
          </div>
          <div className="headings2">
            <p>Welcome Back! Let’s Grow Your Income</p>
          </div>
          <div className="login-form-container">
            <div className="input-group">
              <label htmlFor="email">Email, Phone</label>
              <input
                type="text"
                id="email"
                placeholder="Enter your email or phone number"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="forgot-password">
              <a
                href="99"
                onClick={(e) => {
                  e.preventDefault();
                  props.onForgotPasswordClick();
                }}
              >
                Forgot Password?
              </a>
            </div>
            <div className="main-button-login">
              <button>Login</button>
            </div>
            <div className="last1">
              <p>
                don’t have an account?
                <a
                  href="98"
                  onClick={(e) => {
                    e.preventDefault();
                    props.onRegisterClick();
                  }}
                >
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
