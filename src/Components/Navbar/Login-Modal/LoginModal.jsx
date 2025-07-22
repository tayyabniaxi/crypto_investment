import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginModal.css";
import LoginFrame from "../../../Assets/LoginFrame.svg";
import Navbar from "../Navbar";
import {API_BASE_URL} from '../../../config/api';

const LoginModal = () => {
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          
          // Check if user is admin (silently redirect)
          if (parsedUser.isAdmin || parsedUser.role === 'admin') {
            navigate('/admin');
            return;
          } else {
            // Regular user
            navigate('/dashboard');
            return;
          }
        } catch (error) {
          // If user data is corrupted, clear localStorage
          console.error('Corrupted user data, clearing localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('adminToken');
        }
      }
      setChecking(false);
    };

    checkAuthentication();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {};

    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or phone is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // API call to unified login endpoint
        const response = await fetch(`${API_BASE_URL}/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailOrPhone,
            password: password
          }),
        });

        const data = await response.json();

        if (response.ok && data.meta.status) {
          // Success - save token and user data
          if (data.data.token && data.data.user) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            // Check if user is admin (silent handling)
            if (data.data.user.isAdmin || data.data.user.role === 'admin') {
              // Admin login - silent redirect
              localStorage.setItem('adminToken', data.data.token);
              navigate("/admin");
            } else {
              // Regular user login
              // Show appropriate message based on verification status
              if (data.data.user.verificationStatus === 'pending') {
                alert('Login successful! Your account is pending admin approval. You can view your dashboard but some features may be limited.');
              } else if (data.data.user.verificationStatus === 'approved') {
                alert('Login successful! Welcome back.');
              } else {
                alert('Login successful!');
              }
              
              navigate("/dashboard");
            }
          } else {
            setErrors({
              api: 'Invalid response from server. Please try again.'
            });
          }

        } else {
          // Show API error
          setErrors({
            api: data.meta.message || 'Login failed. Please check your credentials.'
          });
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrors({
          api: 'Network error. Please check your connection and try again.'
        });
      }
    }

    setLoading(false);
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();

    // Show alert and redirect
    alert('Please select an investment plan first to register yourself.');

    // Navigate to homepage plans section
    navigate("/#Plans");

    // Scroll to plans section
    setTimeout(() => {
      const plansSection = document.getElementById('Plans');
      if (plansSection) {
        plansSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Show loading while checking authentication
  if (checking) {
    return (
      <div className="auth-checking">
        <div className="auth-checking-content">
          <div className="spinner"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-left">
          <h2 className="login-title">Login to Account</h2>
          <p className="login-subtitle">Welcome Back! Let's Grow Your Income</p>

          {errors.api && (
            <div className="error-message api-error">{errors.api}</div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="label-data">Email, Phone</label>
            <input
              type="text"
              placeholder="Enter your email or phone number"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              disabled={loading}
            />
            {errors.emailOrPhone && (
              <p className="error-message">{errors.emailOrPhone}</p>
            )}

            <label className="label-data">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}

            <button
              type="submit"
              className="login-buttonn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="register-link">
              Don't have an account?{" "}
              <a href="#" onClick={handleRegisterClick}>
                Register
              </a>
            </div>
          </form>

          {/* User Information Section */}
          <div className="user-info-section" style={{ 
            marginTop: '25px', 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ 
              fontSize: '16px', 
              marginBottom: '12px', 
              color: '#495057',
              fontWeight: '600'
            }}>
              📈 Investment Platform Access
            </h4>
            <div style={{ fontSize: '13px', color: '#6c757d', lineHeight: '1.5' }}>
              <p style={{ marginBottom: '8px' }}>
                <strong>✓ New Users:</strong> Select an investment plan from our homepage first
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>✓ Registration:</strong> Complete signup with payment verification
              </p>
              <p style={{ marginBottom: '8px' }}>
                <strong>✓ Approval:</strong> Wait for account verification to access all features
              </p>
              <p style={{ marginBottom: '0' }}>
                <strong>✓ Dashboard:</strong> Track investments, referrals, and withdrawals
              </p>
            </div>
          </div>
        </div>

        <div className="login-right">
          <img
            src={LoginFrame}
            alt="Login Illustration"
            className="login-image"
          />
        </div>
      </div>
    </>
  );
};

export default LoginModal;