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
            paragraph="Just 12 days after investing, I received my first profit payout. The website’s live updates and their passion for the seashell trade really impressed me"
          ></Card3>
          <Card3
            imgNew={pt2}
            paragraph="I joined 10 days ago and my first return has already arrived. Clear tracking on the website and knowing it’s backed by the seashell industry gave me confidence."
          ></Card3>
          <Card3
            imgNew={pt3}
            paragraph="Within two weeks, my investment started paying off exactly as promised. I admire how they’ve turned the beauty of seashells into real business."
          ></Card3>
          <Card3
            imgNew={pt4}
            paragraph="Got my first earnings in only 8 working days. The transparency of the dashboard and their focus on rare seashells make them unique."
          ></Card3>
          <Card3
            imgNew={pt5}
            paragraph="First profit came in after 14 days — smooth process and I love being part of a company dealing in something as natural as seashells."
          ></Card3>
          <Card3
            imgNew={pt6}
            paragraph="It took less than two weeks for my first payout to hit my account. The website shows everything clearly, and the seashell trade angle makes it exciting."
          ></Card3>
        </div>
      </div>
    </div>
  );
}
