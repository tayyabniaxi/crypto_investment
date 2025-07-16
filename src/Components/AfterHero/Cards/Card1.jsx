import "./Cards1.css";
export default function Card1(props) {
  return (
    <div className="everycard">
      <div className="card" id="card">
        <div className="card-upper-body">
          <h5 className="card-title" id="card-title1">
            {props.name}
          </h5>
          <div>
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
              <strong>$100</strong>
            </li>
            <li>
              <span>Daily Return (1%):</span>
              <strong>$1</strong>
            </li>
            <li>
              <span>Weekly Income:</span>
              <strong>$10</strong>
            </li>
            <li>
              <span>Monthly Income:</span>
              <strong>$30</strong>
            </li>
            <li>
              <span>Duration Flexibility:</span>
              <strong>No lock-in</strong>
            </li>
            <li>
              <span>Referral Bonus:</span>
              <strong>20%</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
