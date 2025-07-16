import "./Cards1.css";
import "./investmentPlans";
import { investmentPlans } from "./investmentPlans";
export default function Card1(props) {
  const planName = props.name.toLowerCase();
  const planData = investmentPlans[planName];
  return (
    <div className="everycard">
      <div className="card" id="card">
        <div className="card-upper-body">
          <h5 className="card-title" id="card-title1">
            {props.name}
          </h5>
          <div id="text-inside">
            <p className="card-text" id="card-text1">
              {props.p1}
            </p>
            <p className="card-text" id="card-text2">
              {props.p2}
            </p>
          </div>
          <div>
            <button id="button">Choose Plane</button>
          </div>
        </div>

        <div id="main-list">
          <ul id="list1">
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
            <li>
              <span>Weeks:</span>
              <strong>{planData.monthlyIncome}</strong>
            </li>
            <li>
              <span>Months:</span>
              <strong>{planData.duration}</strong>
            </li>
            <li>
              <span></span>
              <strong></strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
