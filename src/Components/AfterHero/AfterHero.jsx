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
          <p>Investment Plan</p>
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
            name="Gold Plan"
            p1="Shine with Bigger Profits."
            p2="Reliable returns with serious momentum."
          />
          <Card1
            name="Platinum Plan"
            p1="Earn Like a King."
            p2="For those who play big and win big."
          />
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
              para2="No hidden fees. Know exactly what you earn and how you earn. Everything is clearly tracked and displayed."
            />
            <Card2
              img={pic3}
              para1="Real Time Dashboard Tracking"
              para2="No hidden fees. Know exactly what you earn and how you earn. Everything is clearly tracked and displayed."
            />
            <Card2
              img={pic4}
              para1="Trusted by Hundreds of Investors"
              para2="No hidden fees. Know exactly what you earn and how you earn. Everything is clearly tracked and displayed."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
