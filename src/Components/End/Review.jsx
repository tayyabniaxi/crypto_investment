import "./Review.css";
import Card3 from "./Cards3/Cards3";
import pt1 from "../../Assets/pt1.png";
import pt2 from "../../Assets/pt2.png";
import pt3 from "../../Assets/pt3.png";
import pt4 from "../../Assets/pt4.png";
import pt5 from "../../Assets/pt5.png";
import pt6 from "../../Assets/pt6.png";

export default function Review() {
  return (
    <div id="section1-end">
      <div id="card-section">
        <div className="main-heading1" id="Reviews">
          <p>Trusted Reviews</p>
        </div>
        <div id="Card3-end">
          <Card3
            imgNew={pt1}
            paragraph="The team exceeded my expectations!
They designed a stunning, user
friendly app for my business and
delivered it on time. Highly
recommend their services!"
          ></Card3>
          <Card3
            imgNew={pt2}
            paragraph="Fantastic experience from start to
finish. Their web development team
built us a high-performance website
that looks great and works
flawlessly. Super professional!"
          ></Card3>
          <Card3
            imgNew={pt3}
            paragraph="I was impressed by their SEO
strategy we saw traffic improve
within weeks! Plus, the design team
gave our brand a fresh, modern look.
Truly talented people."
          ></Card3>
          <Card3
            imgNew={pt4}
            paragraph="Clean code, creative design, and
constant communication. They
developed a mobile app for us that
users absolutely love. Would work
with them again 100%."
          ></Card3>
          <Card3
            imgNew={pt5}
            paragraph="Their UI/UX work is next-level! My
web app is not only beautiful but
also super easy to use. Their
attention to detail is unmatched."
          ></Card3>
          <Card3
            imgNew={pt6}
            paragraph="From SEO to app development, they
handled everything smoothly. The
results speak for themselves better
rankings, more traffic, and a faster
app. Great job, team!"
          ></Card3>
        </div>
      </div>
    </div>
  );
}
