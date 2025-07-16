import React, { useState } from "react";
import "./RegisterModal.css";
import LoginFrame from "../../../Assets/LoginFrame.svg";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

const RegisterModal = () => {
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or phone is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!file) {
      newErrors.file = "Payment screenshot is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log({ emailOrPhone, password, file });
      navigate("/otp");
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <div className="signup-left">
          <div className="signup-form-box">
            <h2>Sign Up</h2>
            <p>Build Your Future, One Click at a Time</p>
            <form onSubmit={handleSubmit}>
              <label>Email, Phone</label>
              <input
                type="text"
                placeholder="Enter your email or phone number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
              {errors.emailOrPhone && (
                <p className="error-message">{errors.emailOrPhone}</p>
              )}

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}

              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Enter to confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}

              <label>Payment Screenshot</label>
              <div className="file-upload-box">
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="payment"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("payment").click()}
                  >
                    Upload
                  </button>
                </div>
              </div>
              {errors.file && <p className="error-message">{errors.file}</p>}

              <button type="submit" className="signup-btn">
                Sign Up
              </button>
            </form>

            <p className="login-link">
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Login
              </a>
            </p>
          </div>
        </div>

        <div className="signup-right">
          <img src={LoginFrame} alt="signup illustration" />
        </div>
      </div>
    </>
  );
};

export default RegisterModal;
