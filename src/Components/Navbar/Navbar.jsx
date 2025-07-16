import React, { useState } from "react";
import logoImage from "../../Assets/icon.png";
import "./Navbar.css";
import LoginModal from "./Login-Modal/LoginModal";
import RegisterModal from "./RegisterModal/RegisterModal";
import ForgotPasswordModal from "./ForgotPassword/ForgotPassword";
import OtpModal from "./OtpModal/otpModal";
import NewPasswordModal from "./NewPassword/newPassword";
export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [recoveryValue, setRecoveryValue] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function openLoginModal() {
    setIsLoginModalOpen(true);
    setIsMenuOpen(false);
  }

  function openRegisterModal() {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  }

  function toggleMobileMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <div className="navbar-wrapper">
      <nav className="navbar-container">
        <a className="navbar-logo-link" href="#">
          <img src={logoImage} alt="SeaShell Logo" className="navbar-logo" />
        </a>

        <button
          className={`menu-toggle-btn ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="menu-icon"></span>
        </button>

        <div
          className={`menu-links-container ${isMenuOpen ? "menu-visible" : ""}`}
        >
          <ul className="menu-links">
            <li className="menu-item">
              <a className="menu-link active" href="#">
                Home
              </a>
            </li>
            <li className="menu-item">
              <a className="menu-link" href="#">
                Plans
              </a>
            </li>
            <li className="menu-item">
              <a className="menu-link" href="#">
                Reviews
              </a>
            </li>
            <li className="menu-item">
              <a className="menu-link" href="#">
                Contact
              </a>
            </li>
            <li className="menu-item mobile-login-item">
              <button
                className="login-button mobile-login-button"
                onClick={openLoginModal}
              >
                Login
              </button>
            </li>
          </ul>
        </div>

        <div className="login-button-wrapper">
          <button className="login-button" onClick={openLoginModal}>
            Login
          </button>
        </div>
      </nav>

      {}
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onRegisterClick={() => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
          onForgotPasswordClick={() => {
            setIsLoginModalOpen(false);
            setIsForgotPasswordOpen(true);
          }}
        />
      )}
      {isRegisterModalOpen && (
        <RegisterModal
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      )}
      {isForgotPasswordOpen && (
        <ForgotPasswordModal
          onClose={() => setIsForgotPasswordOpen(false)}
          onSwitchToOTP={(input) => {
            setIsForgotPasswordOpen(false);
            setRecoveryValue(input);
            setIsOTPModalOpen(true);
          }}
        />
      )}
      {isOTPModalOpen && (
        <OtpModal
          onClose={() => setIsOTPModalOpen(false)}
          onVerify={(otp) => {
            if (otp.length === 6) {
              setIsOTPModalOpen(false);
              setIsResetModalOpen(true);
            } else {
              alert("Invalid OTP");
            }
          }}
        />
      )}
      {isResetModalOpen && (
        <NewPasswordModal onClose={() => setIsResetModalOpen(false)} />
      )}
    </div>
  );
}
