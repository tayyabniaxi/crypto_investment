import "./AfterHero.css";
import Card1 from "./Cards/Card1";
import Card2 from "./Cards2/Cards2";
import pic1 from "../../Assets/Picture1.png";
import pic2 from "../../Assets/Picture2.png";
import pic3 from "../../Assets/Picture3.png";
import pic4 from "../../Assets/Picture4.png";

export default function AfterHero() {
  return (
    <div className="main-div-afterHero">
      <div className="all-data-inside">
        <div className="main-heading1">
          <p id="Plans">Investment Plan</p>
        </div>

        <div className="sub-heading1">
          <p>
            Choose Your Plan, Grow Your Income Daily. Simple, Secure, and
            Scalable Returns.
          </p>
        </div>

        <div className="cardsInside">
          <Card1
            name="Bronze"
            p1="Start Small, Earn Steady."
            p2="Perfect for first-time investors looking for daily returns."
          />
          <Card1
            name="Silver"
            p1="Double the Growth"
            p2="Step up your earnings with consistent daily profits."
          />
          <Card1
            name="Gold"
            p1="Shine with Bigger Profits."
            p2="Reliable returns with serious momentum."
          />
          <Card1
            name="Platinum"
            p1="Earn Like a King."
            p2="For those who play big and win big."
          />
          <div className="remainng-cards">
            <Card1
              name="Diamond"
              p1="Diamond Investment Plan"
              p2="Where your money shines as bright as your future."
            />
            <Card1
              name="Elite"
              p1="Elite Investment Plan"
              p2="Invest like a pro with elite tools insights, and returns."
            />
          </div>
        </div>

        <div className="Second-cardsInside">
          <div className="main-heading1">
            <p>Why Choose Us</p>
          </div>

          <div className="cardsInside">
            <Card2
              img={pic1}
              para1="Transparent profit system"
              para2="No hidden fees. Know exactly what you earn and how you earn. Everything is clearly tracked and displayed."
            />
            <Card2
              img={pic2}
              para1="Fixed Daily Income"
              para2="Enjoy a guaranteed 1% daily return on your investment without market risk or fluctuation."
            />
            <Card2
              img={pic3}
              para1="Real Time Dashboard Tracking"
              para2="Monitor your earnings, referrals, and withdrawals with a live, easy to-use dashboard anytime, anywhere."
            />
            <Card2
              img={pic4}
              para1="Trusted by Hundreds of Investors"
              para2="Our platform is backed by a
strong and growing community
who trust us for timely payouts
and reliable service."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
