import React, { useState, useEffect } from "react";
import "./RegisterModal.css";
import LoginFrame from "../../../Assets/LoginFrame.svg";
import UploadScreenshot from "../../../Assets/Upload-Screenshot.svg";
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
  const [referralCode, setReferralCode] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [adminAccountNumber, setAdminAccountNumber] = useState("");
  const [loading, setLoading] = useState(true);

  // Email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Phone regex pattern (supports various formats)
  const phoneRegex = /^(\+92|92|0)?[0-9]{10,11}$/;
  
  // Password regex pattern (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    const planFromUrl = searchParams.get('plan');
    const refFromUrl = searchParams.get('ref');
    
    if (refFromUrl) {
      setReferralCode(refFromUrl);
    }
    
    if (planFromUrl && investmentPlans[planFromUrl]) {
      setSelectedPlan(planFromUrl);
    } else {
      navigate('/');
    }

    loadAdminAccountNumber();
  }, [searchParams, navigate]);

  const loadAdminAccountNumber = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/account-number`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.meta.status) {
          setAdminAccountNumber(data.data.accountNumber || "Loading account number...");
        } else {
          setAdminAccountNumber("Account number not available");
        }
      } else {
        setAdminAccountNumber("Account number not available");
      }
    } catch (error) {
      setAdminAccountNumber("Account number not available");
    } finally {
      setLoading(false);
    }
  };

  const copyAccountNumber = () => {
    if (adminAccountNumber && adminAccountNumber !== "Loading account number..." && adminAccountNumber !== "Account number not available") {
      navigator.clipboard.writeText(adminAccountNumber).then(() => {
        alert('Account number copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = adminAccountNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Account number copied to clipboard!');
      });
    } else {
      alert('Account number not available to copy');
    }
  };

  // Validation functions
  const validateEmailOrPhone = (value) => {
    if (!value.trim()) {
      return "Email or phone number is required";
    }
    
    // Check if it's an email
    if (value.includes('@')) {
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address (e.g., user@example.com)";
      }
    } else {
      // Check if it's a phone number
      const cleanPhone = value.replace(/\s+/g, '').replace(/-/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        return "Please enter a valid phone number (e.g., 03001234567 or +923001234567)";
      }
    }
    
    return null;
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      return "Password is required";
    }
    
    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    }
    
    if (!passwordRegex.test(value)) {
      return "Password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)";
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate email/phone
    const emailPhoneError = validateEmailOrPhone(emailOrPhone);
    if (emailPhoneError) {
      newErrors.emailOrPhone = emailPhoneError;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Validate confirm password
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
        
        if (referralCode) {
          formData.append('referralCode', referralCode);
        }

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
 
            {referralCode && (
              <div className="referral-info">
                <p className="referral-message">
                  🎉 You're signing up with referral code: <strong>{referralCode}</strong>
                </p>
                <p className="referral-bonus">Your referrer will receive a $3 bonus when your account gets approved!</p>
              </div>
            )}

            {/* {selectedPlanData && (
              <div className="selected-plan-display">
                <h4>Selected Plan: <span className="plan-name">{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</span></h4>
                <div className="plan-details">
                  <p><strong>Investment:</strong> {selectedPlanData.investmentAmount}</p>
                  <p><strong>Daily Return:</strong> {selectedPlanData.dailyReturn}</p>
                  <p><strong>Weekly Income:</strong> {selectedPlanData.weeklyIncome}</p>
                </div>
              </div>
            )}  */}

            <form onSubmit={handleSubmit}>
              <label>Email or Phone Number</label>
              <input
                type="text"
                placeholder="Enter your email (e.g., user@example.com) or phone (e.g., 03001234567)"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
              {errors.emailOrPhone && (
                <p className="error-message">{errors.emailOrPhone}</p>
              )}

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter a strong password (8+ chars, with uppercase, lowercase, number & special char)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}

              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password to confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}

              {/* Optional referral code input for manual entry */}
              {!referralCode && (
                <>
                  <label>Referral Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter referral code if you have one"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  />
                </>
              )}

              {/* <label>Payment Account Number</label>
              <div className="account-number-section">
                <textarea
                  value={adminAccountNumber}
                  readOnly
                  className="account-number-input"
                  placeholder={loading ? "Loading account number..." : "Account number will appear here"}
                  rows="2"
                />
                <button
                  type="button"
                  onClick={copyAccountNumber}
                  className="copy-account-btn"
                  disabled={loading || !adminAccountNumber || adminAccountNumber === "Loading account number..." || adminAccountNumber === "Account number not available"}
                >
                  📋 Copy
                </button>
              </div>
              <small className="account-info">Use this account number to make your payment, then upload the screenshot below.</small> */}

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
                {file && (
                  <div className="file-selected">
                    <span>Selected: {file.name}</span>
                  </div>
                )}
              </div>
              {errors.file && <p className="error-message">{errors.file}</p>}
              {errors.plan && <p className="error-message">{errors.plan}</p>}

              <button type="submit" className="signup-btn">
                Sign Up with {selectedPlan ? selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1) : ''} Plan
                {referralCode && ' + Referral Bonus'}
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
          <div className="upload-instructions">
            <h3>
              <span className="note-red">Note !</span> Upload Your Payment Screenshot :
            </h3>
            <p>
              Upload your payment screenshot in given input field, then we will verify your payment.
            </p>
            <img src={UploadScreenshot} alt="Upload Illustration" className="upload-illustration" />
          </div>
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
            {referralCode && (
              <p className="referral-success">
                🎉 You were referred by someone! They will receive a $3 bonus when your account gets approved by admin.
              </p>
            )}
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