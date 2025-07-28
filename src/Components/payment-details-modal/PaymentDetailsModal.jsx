import React from "react";
import "./PaymentDetailsModal.css";
import CloseButtonIconn from "../../Assets/CloseButtonIconn.svg";

const PaymentDetailsModal = ({ planName, onClose, onConfirm }) => {
  return (
    <div className="modal-backdrop">
      <div className="payment-modal">
        <div className="modal-header">
          <h2>Add Investment Balance</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close Modal"
          >
            <img src={CloseButtonIconn} alt="Close" />
          </button>
        </div>

        <div className="modal-table">
          <div className="modal-row">
            <span>Invest Plan</span>
            <span className="modal-link">{planName}</span>
          </div>
          <div className="modal-row">
            <span>Amount</span>
            <span className="modal-link">$1000</span>
          </div>
          <div className="modal-row">
            <span>Bank Name</span>
            <span className="modal-link">bank name</span>
          </div>
          <div className="modal-row">
            <span>Account Name</span>
            <span className="modal-link">account name</span>
          </div>
          <div className="modal-row">
            <span>Account Number</span>
            <span className="modal-link">account number</span>
          </div>
        </div>

        <p className="modal-description">
          Send the selected investment plan amount to the given bank account.
          Once we verify the payment, you can sign up to access your account.
        </p>

        <button className="modal-button" onClick={onConfirm}>
          Continue to signup
        </button>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
