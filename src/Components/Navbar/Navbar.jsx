import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../../Assets/icon.png";
import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollClick = (targetId) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollToId: targetId } });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar-container">
        <Link to="/" className="navbar-logo-link">
          <img src={logoImage} alt="SeaShell Logo" className="navbar-logo" />
        </Link>

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
              <span
                className="menu-link"
                style={{ cursor: "pointer" }}
                onClick={() => handleScrollClick("FAQs")}
              >
                FAQs
              </span>
            </li>
            <li className="menu-item">
              <span
                className="menu-link"
                style={{ cursor: "pointer" }}
                onClick={() => handleScrollClick("Plans")}
              >
                Plans
              </span>
            </li>
            <li className="menu-item">
              <span
                className="menu-link"
                style={{ cursor: "pointer" }}
                onClick={() => handleScrollClick("Reviews")}
              >
                Reviews
              </span>
            </li>

            <li className="menu-item mobile-login-item">
              <button
                className="login-button mobile-login-button"
                onClick={handleLoginClick}
              >
                Login
              </button>
            </li>
          </ul>
        </div>

        <div className="login-button-wrapper">
          <button className="login-button" onClick={handleLoginClick}>
            Login
          </button>

          {/* <button
            className="sign-up"
            onClick={() => {
              const plansSection = document.getElementById("Plans");
              if (plansSection) {
                plansSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Sign Up
          </button> */}
        </div>
      </nav>
    </div>
  );
}
