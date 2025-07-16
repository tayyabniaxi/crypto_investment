import React, { useState } from "react";
import logoImage from "../../Assets/icon.png";
import "./Navbar.css";
import LoginModal from "./Login-Modal/LoginModal"; 
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = () => {
    setShowLoginPage(true);
    setIsMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (showLoginPage) {
    return <LoginModal onBack={() => setShowLoginPage(false)} />;
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
              <a className="menu-link" href="#FAQs">
                FAQs
              </a>
            </li>
            <li className="menu-item">
              <a className="menu-link" href="#Plans">
                Plans
              </a>
            </li>
            <li className="menu-item">
              <a className="menu-link" href="#Reviews">
                Reviews
              </a>
            </li>
            <li className="menu-item">
              <a className="menu-link" href="#Conatacts">
                Contact
              </a>
            </li>
            <li className="menu-item mobile-login-item">
              <button className="login-button mobile-login-button" onClick={handleLoginClick}>
                Login
              </button>
            </li>
          </ul>
        </div>

        <div className="login-button-wrapper">
          <button className="login-button" onClick={handleLoginClick}>
            Login
          </button>
        </div>
      </nav>
    </div>
  );
}
