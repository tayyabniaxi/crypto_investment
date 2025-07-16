import "./card.css";

export default function Card(props) {
  return (
    <div className="my-investment-card">
      <div className="number-ball">{props.ballNumber}</div>
      <div className="main-data-div">
        <h3>{props.heading}</h3>
        <p>{props.paragraph}</p>
      </div>
    </div>
  );
}
