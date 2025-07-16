import anialmgAg from "../../../Assets/icon.png";
import "./RegisterModal.css";

export default function RegisterModal(props) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <img src={anialmgAg} alt="SeaShell Logo" />
            <button className="close-btn" onClick={props.onClose}>
              X
            </button>
          </div>
          <div className="title">
            <p id="signup-title">Sign Up</p>
          </div>
          <div className="subtitle">
            <p>Build Your Future, One Click at a Time</p>
          </div>
          <div className="form-container">
            <div className="input-group">
              <label htmlFor="email-phone">Email, Phone</label>
              <input
                type="text"
                id="email-phone"
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

            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Enter to confirm password"
              />
            </div>
            <div className="forgot-password">
              <a href="2">Forgot Password?</a>
            </div>
            <div className="submit-btn-container">
              <button className="submit-btn">Sign Up</button>
            </div>
            <div className="switch-auth">
              <p>
                Already have account?{" "}
                <a
                  href="1"
                  onClick={(e) => {
                    e.preventDefault();
                    props.onSwitchToLogin();
                  }}
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
