import React, { useState, useEffect } from "react";
import "./PaymentDetailsModal.css";
import CloseButtonIconn from "../../Assets/CloseButtonIconn.svg";
import { API_BASE_URL } from "../../config/api";
import { investmentPlans } from "../AfterHero/Cards/investmentPlans";

const PaymentDetailsModal = ({ planName, onClose, onConfirm }) => {
  const [accountNumber, setAccountNumber] = useState("Loading...");
  const [planDetails, setPlanDetails] = useState({});

  useEffect(() => {
    loadAccountNumber();
    if (planName) {
      setPlanDetails(investmentPlans[planName.toLowerCase()] || {});
    }
  }, [planName]);

  const loadAccountNumber = async () => {
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
          setAccountNumber(data.data.accountNumber);
        } else {
          setAccountNumber("Account number not available");
        }
      } else {
        setAccountNumber("Account number not available");
      }
    } catch (error) {
      setAccountNumber("Account number not available");
    }
  };

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
            <span className="modal-link">{planDetails.investmentAmount || "$0"}</span>
          </div>
         
          <div className="modal-row">
            <span>Bank Name</span>
            <span className="modal-link">Binance</span>
          </div>
          
          <div className="modal-row">
            <span>Account Number</span>
            <span className="modal-link">{accountNumber}</span>
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