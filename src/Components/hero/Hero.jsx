import "./Hero.css";
import Card from "./Card";
export default function Hero() {
  return (
    <div className="hero-container">
      <div className="h1-container">
        <h1 id="main-heading">How It Works</h1>
      </div>
      <div className="card-div">
        <Card
          ballNumber="01"
          heading="Choose an Investment Plan"
          paragraph="Start from as low as X amount and
earn daily returns."
        ></Card>
        <Card
          ballNumber="02"
          heading="Track Your Daily Profits"
          paragraph="Transparent earnings dashboard
updated daily."
        ></Card>
        <Card
          ballNumber="03"
          heading="Refer & Earn More"
          paragraph="Invite friends and earn a % of their
daily profits."
        ></Card>
        <Card
          ballNumber="04"
          heading="Withdraw Anytime"
          paragraph="Easy and secure withdrawals."
        ></Card>
      </div>
    </div>
  );
}
