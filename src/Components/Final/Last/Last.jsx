import "./Last.css";
import myImg1 from "../../../Assets/icon.png";
import button from "../../../Assets/button.png";
export default function Last() {
  return (
    <div className="Last-1">
      <div className="inside-last1">
        <div className="picture-here">
          <a href="">
            <img src={myImg1} alt="hello" id="img124" />
          </a>
        </div>
        <div className="main-text">
          <p>Ready to Start Earning?</p>
        </div>
        <div className="main-text2">
          <p>
            Join our growing community and turn your investment into daily
            income.
          </p>
        </div>
        <div className="New-button-here">
          <button id="my-button">
            <img src={button} alt="button" id="img1" />
          </button>
        </div>
        <div id="line">
          <hr />
        </div>
        <div id="last-line-text">
          <p>
            Copyright © 2024 <strong>seashell.com </strong>all rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
