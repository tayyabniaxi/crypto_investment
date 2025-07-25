import React, { useState, useEffect } from "react";
import "./RegisterModal.css";
import LoginFrame from "../../../Assets/LoginFrame.svg";
import Navbar from "../Navbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { investmentPlans } from "../../AfterHero/Cards/investmentPlans";
import { API_BASE_URL } from "../../../config/api";

const RegisterModal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const planFromUrl = searchParams.get('plan');
    if (planFromUrl && investmentPlans[planFromUrl]) {
      setSelectedPlan(planFromUrl);
    } else {
      navigate('/');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
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

    if (!selectedPlan) {
      newErrors.plan = "Please select a plan first";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const formData = new FormData();
        formData.append('email', emailOrPhone);
        formData.append('password', password);
        formData.append('screenshot', file);
        formData.append('selectedPlan', selectedPlan);

        const response = await fetch(`${API_BASE_URL}/user/signup`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.meta.status) {
          if (data.data.token) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
          }
          
          setShowSuccessModal(true);
        } else {
          alert(data.meta.message || 'Registration failed');
        }
      } catch (error) {
        alert('Network error. Please try again.');
      }
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  const selectedPlanData = selectedPlan ? investmentPlans[selectedPlan] : null;

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <div className="signup-left">
          <div className="signup-form-box">
            <h2>Sign Up</h2>
            <p>Build Your Future, One Click at a Time</p>

            {selectedPlanData && (
              <div className="selected-plan-display">
                <h4>Selected Plan: <span className="plan-name">{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</span></h4>
                <div className="plan-details">
                  <p><strong>Investment:</strong> {selectedPlanData.investmentAmount}</p>
                  <p><strong>Daily Return:</strong> {selectedPlanData.dailyReturn}</p>
                  <p><strong>Weekly Income:</strong> {selectedPlanData.weeklyIncome}</p>
                </div>
              </div>
            )}

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
                    accept="image/*"
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
              {errors.plan && <p className="error-message">{errors.plan}</p>}

              <button type="submit" className="signup-btn">
                Sign Up with {selectedPlan ? selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1) : ''} Plan
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

      {showSuccessModal && (
        <div className="success-modal-overlay" onClick={handleSuccessModalClose}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">✓</div>
            <h3>Registration Successful!</h3>
            <p>
              Your request has been received with <strong>{selectedPlan?.charAt(0).toUpperCase() + selectedPlan?.slice(1)} Plan</strong>.
            </p>
            <p>
              You will be notified via email once your payment is verified.
            </p>
            <p>Thank you for your patience!</p>
            <button 
              className="success-modal-btn"
              onClick={handleSuccessModalClose}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterModal;