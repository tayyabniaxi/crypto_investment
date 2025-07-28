import "./Cards1.css";
import { investmentPlans } from "./investmentPlans";
import React from "react";

export default function Card1({ name, p1, p2, onChoose }) {
  const planName = name.toLowerCase();
  const planData = investmentPlans[planName];

  return (
    <div className="everycard">
      <div className="card">
        <div className="card-upper-body">
          <h5 className="card-title">{name}</h5>
          <div className="text-inside">
            <p className="card-text1">{p1}</p>
            <p className="card-text2">{p2}</p>
          </div>
          <button className="card-button" onClick={() => onChoose(name)}>
            Choose Plan
          </button>
        </div>

        <div className="main-list">
          <ul className="list1">
            <li>
              <span>Investment Amount:</span>
              <strong>{planData.investmentAmount}</strong>
            </li>
            <li>
              <span>Daily Return (1%):</span>
              <strong>{planData.dailyReturn}</strong>
            </li>
            <li>
              <span>Weekly Income:</span>
              <strong>{planData.weeklyIncome}</strong>
            </li>
          
          </ul>
        </div>
      </div>
    </div>
  );
}
